import sys
from src.gmaps import Gmaps

def main():
    queries = sys.argv[1:]  # Skip the script name, start from the first argument
    Gmaps.places(queries, scrape_reviews=True, reviews_max=25, reviews_sort=Gmaps.HIGHEST_RATING)

if __name__ == "__main__":
    main()



