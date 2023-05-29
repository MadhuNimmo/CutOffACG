import sys
import os
import json

directory = sys.argv[1]

json_files = []
for filename in os.listdir(directory):
    if filename.endswith("BND2.json"):
        json_files.append(os.path.join(directory, filename))

# Define an empty list to store the JSON data
json_data = []

# Loop through each input file and load the JSON data
for file in json_files:
    with open(file) as f:
        data = json.load(f)
        json_data.append(data)

# Merge the JSON data into a single object
merged_data = {}
'''for data in json_data:
    merged_data.update(data)'''
for data in json_data:
        for key, value in data.items():
                if key not in merged_data:
                      merged_data[key]=data[key]
                else:
                     for inner_key, inner_value in value.items():
                        if inner_key not in merged_data[key]:
                              merged_data[key][inner_key]=data[key][inner_key]
                        else:
                             for item in inner_value:
                                if item not in merged_data[key][inner_key]:
                                        merged_data[key][inner_key].append(item)
        


# Write the merged JSON data to a file
with open(directory+"/mergedSCG_BND2.json", "w") as f:
    json.dump(merged_data, f, indent=4)