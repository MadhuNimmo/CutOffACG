import json
import argparse
import numpy as np
from collections import Counter

# Create an ArgumentParser object
parser = argparse.ArgumentParser(description='Example script to receive arguments')

# Add an argument to the parser
parser.add_argument('inpfilename')
parser.add_argument('outfilename')

# Parse the arguments passed to the script
args = parser.parse_args()

def string_contains_substrings(string, substrings):
        for substring in substrings:
                if substring in string:
                        return True
        return False

# Open the JSON file and load its contents
with open(args.inpfilename, 'r') as file:
    json_obj = json.load(file)

new_json_obj = {}

for key, value in json_obj.items():
        if key not in new_json_obj:
                new_json_obj[key] ={}
        for inner_key, inner_value in value.items():
                if inner_key.count("(Native)") ==2 and key.count("(Native)") ==2:
                        print(key+"--->"+inner_key)
                if inner_key not in new_json_obj[key]:
                        new_json_obj[key][inner_key] = []
                for inner_val in inner_value:
                        if not((inner_key.endswith("(Native)") or inner_key.endswith("(Native)]")) and (inner_val.endswith("(Native)") or inner_val.endswith("(Native)]"))):
                                new_json_obj[key][inner_key].append(inner_val)


'''with open(args.outfilename, 'w') as f:
    # Write the JSON data to the file
    json.dump(new_json_obj, f,indent=2)'''