import json
from statistics import median
from collections import Counter
import argparse

# Create an ArgumentParser object
parser = argparse.ArgumentParser(description='Example script to receive arguments')

# Add an argument to the parser
parser.add_argument('inpfilename')
parser.add_argument('outfilename')

# Parse the arguments passed to the script
args = parser.parse_args()


# Open the JSON file and load its contents
with open(args.inpfilename, 'r') as file:
    json_obj = json.load(file)


# Load JSON object

# Compute number of values per key
#values_per_key = [len(val) if isinstance(val, list) else 1 for val in json_obj.values()]
values_per_key = []
for key, value in json_obj.items():
    if isinstance(value,list):
        values_per_key = [len(val) if isinstance(val, list) else 1 for val in json_obj.values()]
    else:
        for inner_key, inner_value in value.items():
            values_per_key.append(len(inner_value))

# Compute mean
mean = sum(values_per_key) / len(values_per_key)

# Compute median
median = median(values_per_key)

# Compute mode
mode = Counter(values_per_key).most_common(1)[0][0]

# Print results
#print("Values per key:", values_per_key)
unique_values = list(set(values_per_key))
print(unique_values)
print("Mean:", mean)
print("Median:", median)
print("Mode:", mode)

new_json_obj = {}

for key, value in json_obj.items():
    if isinstance(value,list):
        values_per_key = [len(val) if isinstance(val, list) else 1 for val in json_obj.values()]
    else:
        for inner_key, inner_value in value.items():
            if len(inner_value)< 100:
                if key not in new_json_obj:
                        new_json_obj[key] ={}
                        if inner_key not in new_json_obj[key]:
                            #new_json_obj[key][inner_key] = []
                            new_json_obj[key][inner_key] = inner_value
            else:
                if key not in new_json_obj:
                        new_json_obj[key] ={}
                        if inner_key not in new_json_obj[key]:
                            #new_json_obj[key][inner_key] = []
                            new_json_obj[key][inner_key] = inner_value[:100]

values_per_key = []
for key, value in new_json_obj.items():
    if isinstance(value,list):
        values_per_key = [len(val) if isinstance(val, list) else 1 for val in json_obj.values()]
    else:
        for inner_key, inner_value in value.items():
            values_per_key.append(len(inner_value))

#print(values_per_key)

mean = sum(values_per_key) / len(values_per_key)

# Compute mode
mode = Counter(values_per_key).most_common(1)[0][0]

unique_values = list(set(values_per_key))

print(unique_values)
print("Mean:", mean)

print("Mode:", mode)
# Open a file for writing (creates the file if it doesn't exist)
with open(args.outfilename, 'w') as f:
    # Write the JSON data to the file
    json.dump(new_json_obj, f)
