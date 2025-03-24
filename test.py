import ipfshttpclient
client = ipfshttpclient.connect()
with open("test.txt", "w") as f:
    f.write("Hello from IPFS!")
res = client.add("test.txt")
print(f"IPFS Hash: {res['Hash']}")