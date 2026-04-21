FROM python:3.12-slim
RUN pip install --no-cache-dir devpi-server devpi-client
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
EXPOSE 3141
ENTRYPOINT ["/entrypoint.sh"]