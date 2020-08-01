#!/usr/bin/python3.8
import json
import argparse


def reconstruct(url):
    # opens file with op handler in read mode
    with open("org.js.nuclear.Nuclear.json") as f:
        print("loading data")
        # loading json as dict
        data = json.load(f)
        # closing the file handler b/c it looks the file
        f.close()
        print("Modifying data")
        # updates the url value. the wierd formating is due to python loading the file
        # using python data types
        data["modules"][0]["sources"][0]["url"] = url
        print("done")
    # opens file in write mode
    with open("org.js.nuclear.Nuclear.json", "w") as f:
        print("updating json")
        # formates data with some pretty printing
        formated_data = json.dumps(data, indent=4, sort_keys=True)
        # writes data to the file
        f.writelines(formated_data)
        # close file handler b/c best pratices
        f.close()
        print("done")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", type=str, help="url to replace.")
    args = parser.parse_args()
    if args != None:
        reconstruct(args.url)
    else:
        print("No arguments give requires Url to continue")


if __name__ == "__main__":
    main()
