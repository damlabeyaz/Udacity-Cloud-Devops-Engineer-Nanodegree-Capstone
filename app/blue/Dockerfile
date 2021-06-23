FROM node:12.13.1-stretch-slim

wysiwyg

WORKDIR /app

COPY app/ /app/blue

RUN echo "Installing node dependencies" && \
    npm install

CMD ["/bin/bash", "-c", "npm run start"]