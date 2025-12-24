"""Main entry point for the application."""

from src.config import config
from src.utils.logger import Logger


def main() -> None:
    """Run the main application."""
    logger = Logger(__name__)

    logger.info('Starting Python UV Simple application')
    logger.info(f'Environment: {config.environment}')
    logger.info(f'Debug mode: {config.debug}')
    logger.info(f'Log level: {config.log_level}')

    try:
        # Your application logic here
        logger.info('Application running successfully')
    except Exception as e:
        logger.error(f'Application error: {e}')
        raise
    finally:
        logger.info('Application shutdown')


if __name__ == '__main__':
    main()
