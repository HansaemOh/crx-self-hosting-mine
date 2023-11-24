from flask import Flask, send_from_directory, send_file

app = Flask(__name__)

# 확장 프로그램 파일이 있는 디렉토리
DIRECTORY = "./dist/"

@app.route('/')
def home():
    return "Welcome to the Chrome Extension Hosting Server!"

# @app.route('/<path:filename>')
# def download_file(filename):
#     return send_from_directory(DIRECTORY, filename)

# @app.route('/download-extension')
@app.route('/<path:filename>')
def download_extension(filename):
    # 파일 경로와 파일명을 지정합니다.
    path_to_crx = DIRECTORY + filename

    # send_file 함수를 사용하여 .crx 파일을 제공합니다.
    # as_attachment=True는 파일 다운로드를 위해 사용됩니다.
    # mimetype='application/x-chrome-extension'은 CRX 파일에 대한 MIME 타입을 설정합니다.
    return send_file(path_to_crx, as_attachment=True, mimetype='application/x-chrome-extension')

if __name__ == "__main__":
    # app.run(host='0.0.0.0', port=80)
    app.run(host='0.0.0.0', port=443, 
            ssl_context=('./cert/localhost+3.pem', './cert/localhost+3-key.pem'))
