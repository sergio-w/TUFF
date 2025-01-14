import base64
import json
from google.protobuf.json_format import MessageToJson
import your_schema_pb2  # Replace with your actual generated module

# Replace 'YourMessage' with the actual message class from your .proto file
from your_schema_pb2 import YourMessage

def decode_protobuf_to_json(b64_data: str) -> str:
    """
    Decodes Base64-encoded Protobuf data into a JSON string.

    :param b64_data: Base64-encoded string representing the Protobuf binary data.
    :return: JSON string representation of the Protobuf message.
    """
    try:
        # Step 1: Decode the Base64 string into binary data
        binary_data = base64.b64decode(b64_data)
        print("Base64 decoded successfully.")
    except base64.binascii.Error as e:
        print(f"Error decoding Base64 data: {e}")
        return ""

    # Step 2: Parse the binary data using the generated Protobuf class
    message = YourMessage()
    try:
        message.ParseFromString(binary_data)
        print("Protobuf parsed successfully.")
    except Exception as e:
        print(f"Error parsing Protobuf data: {e}")
        return ""

    # Step 3: Convert the Protobuf message to JSON
    try:
        json_data = MessageToJson(message, including_default_value_fields=True)
        print("Conversion to JSON successful.")
        return json_data
    except Exception as e:
        print(f"Error converting Protobuf to JSON: {e}")
        return ""

if __name__ == "__main__":
    # Your Base64-encoded Protobuf data
    b64_data = (
        "AAAABNkSvQEKJDI4NWMzMTE2LTMzMDEtNGRjMy04YzI4LWZjMmI3MzAzMTYwMRABGiExLiBVbmRlcnN0YW5kaW5nIHNpbiwgY29zIGFuZCB0YW4wBVohCQAAAAAAABRAEQAAAAAAAPA/Gg0KAlFWEQAAAAAAAPA/YgJ7fWomChlod2dlbi50YXNrLmJ1aWxkX2NhdGVnb3J5EglpbnRyb2R1Y2VqHQoSaHdnZW4udGFzay5zZWN0aW9uEgdpbmZvY3VzeAESuwEKJDI4NWMzMTE2LTMzMDEtNGRjMy04YzI4LWZjMmI3MzAzMTYwMRACGjIyLiBGaW5kaW5nIHVua25vd24gc2lkZXMgaW4gcmlnaHQtYW5nbGVkIHRyaWFuZ2xlczAGWhIJAAAAAAAAGEARAAAAAAAA8D9qHQoSaHdnZW4udGFzay5zZWN0aW9uEgdpbmZvY3VzaiYKGWh3Z2VuLnRhc2suYnVpbGRfY2F0ZWdvcnkSCWludHJvZHVjZXgBErwBCiQyODVjMzExNi0zMzAxLTRkYzMtOGMyOC1mYzJiNzMwMzE2MDEQAxozMy4gRmluZGluZyB1bmtub3duIGFuZ2xlcyBpbiByaWdodC1hbmdsZWQgdHJpYW5nbGVzMARaEgkAAAAAAAAQQBEAAAAAAADwP2omChlod2dlbi50YXNrLmJ1aWxkX2NhdGVnb3J5EglpbnRyb2R1Y2VqHQoSaHdnZW4udGFzay5zZWN0aW9uEgdpbmZvY3VzeAESuwEKJDI4NWMzMTE2LTMzMDEtNGRjMy04YzI4LWZjMmI3MzAzMTYwMRAEGjI0LiBGaW5kaW5nIHVua25vd24gc2lkZXMgaW4gcmlnaHQtYW5nbGVkIHRyaWFuZ2xlczADWhIJAAAAAAAACEARAAAAAAAA8D9qJgoZaHdnZW4udGFzay5idWlsZF9jYXRlZ29yeRIJaW50cm9kdWNlah0KEmh3Z2VuLnRhc2suc2VjdGlvbhIHaW5mb2N1c3gBEr4BCiQyODVjMzExNi0zMzAxLTRkYzMtOGMyOC1mYzJiNzMwMzE2MDEQBRovNS4gUHJvYmxlbSBzb2x2aW5nOiBGcmFjdGlvbnMgYW5kIG1peGVkIG51bWJlcnMwBVoSCQAAAAAAABRAEQAAAAAAAPA/aiYKGWh3Z2VuLnRhc2suYnVpbGRfY2F0ZWdvcnkSCWludHJvZHVjZWojChJod2dlbi50YXNrLnNlY3Rpb24SDWNvbnNvbGlkYXRpb254ARKtAQokMjg1YzMxMTYtMzMwMS00ZGMzLThjMjgtZmMyYjczMDMxNjAxEAYaHjYuIEludGVycHJldGluZyBzY2F0dGVyIGdyYXBoczADWhIJAAAAAAAACEARAAAAAAAA8D9qJgoZaHdnZW4udGFzay5idWlsZF9jYXRlZ29yeRIJaW50cm9kdWNlaiMKEmh3Z2VuLnRhc2suc2VjdGlvbhINY29uc29saWRhdGlvbngBEmsKJDI4NWMzMTE2LTMzMDEtNGRjMy04YzI4LWZjMmI3MzAzMTYwMRAHGg83LiBUaW1lcyBUYWJsZXMiBEdBTUVaEgkAAAAAAABJQBGamZmZmZnJP2IWeyJnYW1lIjoiIiwibWJYUCI6NTAwfYAAAAAQZ3JwYy1zdGF0dXM6IDANCg=="
    
    # Decode and convert to JSON
    json_output =
