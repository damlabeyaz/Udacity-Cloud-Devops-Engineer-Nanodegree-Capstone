FROM node:12.13.1-stretch-slim

WORKDIR /app
wysiwyg
COPY app/ /app/green

RUN echo "Installing node dependencies" && \
    npm install

CMD ["/bin/bash", "-c", "npm run start"]