import json
import argparse


def reconstruct(url):
    with open("org.js.nuclear.Nuclear.json") as f:
        print("loading data")
        data = json.load(f)
        f.close()
        print("extracting data")
        extracted_data = data["modules"]
        x = extracted_data[0]
        downloads = x["sources"]
        sources = downloads[0]
        print("extracted data complete\nmodifying data")
        sources["url"] = url
        downloads[0] = sources
        x["sources"] = downloads
        extracted_data[0] = x
        data["modules"] = extracted_data
        print("modified data")

    with open("org.js.nuclear.Nuclear.json", "w") as f:
        print("writing data")
        formated_data = json.dumps(data, indent=4, sort_keys=True)
        f.writelines(formated_data)
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
