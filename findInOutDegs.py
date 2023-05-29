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


# Open the JSON file and load its contents
with open(args.inpfilename, 'r') as file:
    json_obj = json.load(file)


def find_outliers(arr):
            # Calculate the first and third quartiles
    Q1 = np.percentile(arr, 25)
    Q3 = np.percentile(arr, 75)
    
    # Calculate the interquartile range (IQR)
    IQR = Q3 - Q1
    
    # Calculate the lower and upper bounds for outliers
    lower_bound = Q1 - 1.5 * IQR
    upper_bound = Q3 + 1.5 * IQR
    
    # Find any data points outside of the bounds
    outliers = [x for x in arr if x < lower_bound or x > upper_bound]
    
    return outliers

def get_in_out_degrees(json_obj):
    # Initialize dictionaries to keep track of indegrees and outdegrees
    indegrees = {key: 0 for key in json_obj.keys()}
    outdegrees = {key: 0 for key in json_obj.keys()}
    
    # Iterate over each key-value pair in the JSON object
    for key, value in json_obj.items():
        # If the value is a dictionary, update the outdegree and indegree counts
        if isinstance(value, dict):
            outdegrees[key]=0
            for sub_key,sub_value in value.items():
                for sub_val in sub_value:
                        if sub_val in json_obj.keys():
                                indegrees[sub_val] += 1
                        if "(Native)" not in sub_val:
                                outdegrees[key]+=1
            #outdegrees[key]+=len(sub_value)
                    
    return indegrees, outdegrees

# Example usage
#json_str = '{"a": {"x": ["b","c"]}, "b": {"y": ["d","e","f"]}, "c": {"z": ["b"]}}'
#json_obj = json.loads(json_str)
indegrees, outdegrees = get_in_out_degrees(json_obj)
print(len(indegrees.keys()))
print(len(outdegrees.keys()))


indegrees_freq = {}
for key, value in indegrees.items():
    if value in indegrees_freq.keys():
        indegrees_freq[value]+=1
    else:
        indegrees_freq[value]=1

outdegrees_freq = {}
for key, value in outdegrees.items():
    if value in outdegrees_freq.keys():
        outdegrees_freq[value]+=1
    else:
        outdegrees_freq[value]=1


print(indegrees_freq)
print(outdegrees_freq)

indegrees_freq_list =[]
for key,value in indegrees_freq.items():
     if key not in indegrees_freq_list:
        indegrees_freq_list.append(value)

outdegrees_freq_list =[]
for key,value in outdegrees_freq.items():
     if value not in outdegrees_freq_list:
        outdegrees_freq_list.append(value)

print("Old")
print(indegrees_freq_list)
print(outdegrees_freq_list)



mean_in = sum(indegrees_freq_list) / len(indegrees_freq_list)

# Compute mode
mode_in = Counter(indegrees_freq_list).most_common(1)[0][0]

print("Mean:", mean_in)

print("Mode:", mode_in)

mean_out = sum(outdegrees_freq_list) / len(outdegrees_freq_list)

# Compute mode
mode_out = Counter(outdegrees_freq_list).most_common(1)[0][0]

print("Mean:", mean_out)

print("Mode:", mode_out)

indegrees_freq_list_outliers = find_outliers(indegrees_freq_list)
print(indegrees_freq_list_outliers)
outdegrees_freq_list_outliers = find_outliers(outdegrees_freq_list)
print(outdegrees_freq_list_outliers)


new_json_obj = {}

for key, value in json_obj.items():
        for inner_key, inner_value in value.items():
            if indegrees[key] >=1 and outdegrees[key] not in outdegrees_freq_list_outliers:
                if key not in new_json_obj:
                        new_json_obj[key] ={}
                        if inner_key not in new_json_obj[key]:
                                new_json_obj[key][inner_key] = inner_value
                else:
                     if inner_key not in new_json_obj[key]:
                                new_json_obj[key][inner_key] = inner_value

with open(args.outfilename, 'w') as f:
    # Write the JSON data to the file
    json.dump(new_json_obj, f)


#indegrees, outdegrees = get_in_out_degrees(new_json_obj)
#print(len(indegrees.keys()))
#print(len(outdegrees.keys()))

'''indegrees_freq_list =[]
for key,value in indegrees.items():
     indegrees_freq_list.append(value)

outdegrees_freq_list =[]
for key,value in outdegrees.items():
     outdegrees_freq_list.append(value)

print("New")
#print(indegrees_freq_list)
#print(outdegrees_freq_list)
indegrees_freq_list_outliers = find_outliers(indegrees_freq_list)
print(indegrees_freq_list_outliers)
outdegrees_freq_list_outliers = find_outliers(outdegrees_freq_list)
print(outdegrees_freq_list_outliers)'''

'''indegrees_freq = {}
for key, value in indegrees.items():
    if value in indegrees_freq.keys():
        indegrees_freq[value]+=1
    else:
        indegrees_freq[value]=1

outdegrees_freq = {}
for key, value in outdegrees.items():
    if value in outdegrees_freq.keys():
        outdegrees_freq[value]+=1
    else:
        outdegrees_freq[value]=1


print(indegrees_freq)
print(outdegrees_freq)'''