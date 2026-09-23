import base64
s = '{"UserID":"82be4d52-bc77-42ad-9885-1854419bf238","Password":"c56e0f5141704c388803a41cf7955f8a"}'
print(base64.b64encode(s.encode('utf-8')).decode('utf-8'))
