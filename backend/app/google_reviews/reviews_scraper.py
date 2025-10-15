import json
from datetime import datetime, timezone
import time
from typing import List, Dict, Any, Tuple, Optional
from google_play_scraper import app, reviews, Sort
from ..shared_services.db import get_postgres_connection
from ..shared_services.logger_setup import setup_logger

logger = setup_logger()

class ReviewScraper:
    def __init__(self, db_name="xpchex"):
        """Initialize the ReviewScraper with database connection"""
        self.conn = get_postgres_connection(db_name)
        self.cursor = self.conn.cursor()

    def save_reviews_to_db(self, reviews_data: List[Dict[str, Any]], app_id: str) -> None:
        """
        Save reviews to raw reviews table and process them
        """
        try:
            # Current timestamp for fetched_at
            fetched_at = datetime.now()
            
            for review in reviews_data:
                self.cursor.execute("""
                    INSERT INTO raw_app_reviews (
                        app_id, review_id, username, user_image, content, score,
                        thumbs_up_count, review_created_at, reply_content,
                        reply_created_at, app_version, fetched_at
                    ) VALUES (
                        %(app_id)s, %(reviewId)s, %(userName)s, %(userImage)s, %(content)s,
                        %(score)s, %(thumbsUpCount)s, %(at)s, %(replyContent)s,
                        %(repliedAt)s, %(reviewCreatedVersion)s, %(fetched_at)s
                    )
                """, {**review, 'app_id': app_id, 'fetched_at': fetched_at})
            
            # Process the raw reviews into the processed table
            processed_count = self.process_raw_reviews(app_id)
            
            self.conn.commit()
            logger.info(f"Successfully saved {len(reviews_data)} reviews to raw table and processed {processed_count} reviews for app {app_id}")
        except Exception as e:
            self.conn.rollback()
            logger.error(f"Error saving reviews to database: {e}")
            raise

    def get_latest_review_date(self, app_id: str) -> Optional[datetime]:
        """
        Get the date of the most recent review in the processed table for a specific app
        """
        try:
            self.cursor.execute("""
                SELECT review_created_at 
                FROM processed_app_reviews 
                WHERE app_id = %s
                ORDER BY review_created_at DESC 
                LIMIT 1
            """, (app_id,))
            result = self.cursor.fetchone()
            if result:
                logger.info(f"Found latest review date for app {app_id}: {result[0]}")
            else:
                logger.info(f"No existing reviews found for app {app_id}")
            return result[0] if result else None
        except Exception as e:
            logger.error(f"Error getting latest review date for app {app_id}: {e}")
            return None

    def process_raw_reviews(self, app_id: str, after_date: Optional[datetime] = None) -> int:
        """
        Process raw reviews into the processed table
        
        Args:
            app_id (str): The app ID to process
            after_date (datetime, optional): If provided, only process reviews fetched after this date
        """
        try:
            self.cursor.execute("SELECT process_raw_reviews(%s, %s)", (app_id, after_date))
            processed_count = self.cursor.fetchone()[0]
            self.conn.commit()
            return processed_count
        except Exception as e:
            self.conn.rollback()
            logger.error(f"Error processing raw reviews: {e}")
            raise

    def fetch_reviews(
        self, 
        app_id: str, 
        count: int = 0, 
        lang: str = 'en', 
        country: str = 'ke',
        batch_size: int = 100,
        incremental: bool = True,
        start_date: Optional[datetime] = None
    ) -> Tuple[int, int]:
        """
        Fetch reviews for a given app and save them to the database.
        
        Args:
            app_id (str): The Google Play Store app ID
            count (int): Number of reviews to fetch. 0 means fetch all available reviews
            lang (str): Language of reviews to fetch
            country (str): Country code for reviews
            batch_size (int): Number of reviews to fetch per batch (max 100)
            incremental (bool): If True, only fetch reviews newer than the latest in DB
            start_date (datetime, optional): If provided, only fetch reviews after this date.
                                          Must be timezone-aware if provided.
        
        Returns:
            tuple: (Total reviews fetched, Total reviews processed)
        """
        continuation_token = None
        total_reviews = 0
        total_processed = 0
        latest_date = self.get_latest_review_date(app_id) if incremental else None

        # If both start_date and incremental are provided, use the later date
        if start_date and latest_date:
            cutoff_date = max(start_date, latest_date)
        else:
            cutoff_date = start_date or latest_date

        logger.info(f"Starting to fetch reviews for {app_id}")
        logger.info(f"Parameters: count={count}, lang={lang}, country={country}, batch_size={batch_size}")
        if cutoff_date:
            logger.info(f"Only fetching reviews after {cutoff_date}")

        try:
            batch_number = 1
            while True:
                logger.info(f"Fetching batch {batch_number} (size: {batch_size})")
                
                # Fetch batch of reviews
                result, continuation_token = reviews(
                    app_id,
                    lang=lang,
                    country=country,
                    count=min(batch_size, count - total_reviews) if count > 0 else batch_size,
                    sort=Sort.NEWEST,
                    continuation_token=continuation_token
                )
                
                if not result:
                    logger.info("No more reviews returned from API")
                    break
                
                logger.info(f"Got {len(result)} reviews in batch {batch_number}")
                
                # Filter reviews by date if cutoff_date is provided
                if cutoff_date:
                    original_count = len(result)
                    result = [r for r in result if r['at'].replace(tzinfo=timezone.utc) > cutoff_date]
                    filtered_count = len(result)
                    if filtered_count < original_count:
                        logger.info(f"Filtered out {original_count - filtered_count} old reviews")
                    if not result:
                        logger.info(f"All reviews in this batch are older than {cutoff_date}")
                        break

                # Save batch to raw table and process
                self.save_reviews_to_db(result, app_id)
                total_reviews += len(result)
                total_processed += len(result)
                
                logger.info(f"Batch {batch_number}: Saved {len(result)} reviews. Running total: {total_reviews}")
                
                # Check if we've reached the requested count
                if count > 0 and total_reviews >= count:
                    logger.info(f"Reached requested count of {count} reviews")
                    break
                    
                if not continuation_token:
                    logger.info("No continuation token returned - no more reviews available")
                    break
                    
                # Add a small delay to avoid hitting rate limits
                time.sleep(1)
                batch_number += 1

        except Exception as e:
            logger.error(f"Error fetching reviews for app {app_id}: {e}")
            raise

        logger.info(f"Finished fetching reviews for {app_id}")
        logger.info(f"Total reviews fetched: {total_reviews}")
        logger.info(f"Total reviews processed: {total_processed}")
        return total_reviews, total_processed

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type is not None:
            # An exception occurred
            self.conn.rollback()
            logger.error(f"Error during ReviewScraper execution: {exc_val}")
        else:
            # No exception occurred
            self.conn.commit()
        
        self.cursor.close()
        self.conn.close()

def main():
    """Command line interface for the ReviewScraper"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Fetch and process Google Play Store reviews')
    parser.add_argument('app_id', help='Google Play Store app ID')
    parser.add_argument('--count', type=int, default=0, help='Number of reviews to fetch (0 for all)')
    parser.add_argument('--lang', default='en', help='Language code (default: en)')
    parser.add_argument('--country', default='ke', help='Country code (default: ke)')
    parser.add_argument('--batch-size', type=int, default=100, help='Batch size for fetching reviews')
    parser.add_argument('--no-incremental', action='store_false', dest='incremental',
                      help='Fetch all reviews instead of only new ones')
    
    args = parser.parse_args()
    
    with ReviewScraper() as scraper:
        total_reviews, total_processed = scraper.fetch_reviews(
            app_id=args.app_id,
            count=args.count,
            lang=args.lang,
            country=args.country,
            batch_size=args.batch_size,
            incremental=args.incremental
        )
        
        print(f"\nSummary:")
        print(f"Total reviews fetched: {total_reviews}")
        print(f"Total reviews processed: {total_processed}")

if __name__ == "__main__":
    main() 