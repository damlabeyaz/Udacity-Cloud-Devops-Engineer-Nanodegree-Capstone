FROM node:14.17.1

WORKDIR /app

COPY . /app/

RUN echo "Installing node dependencies" && \
    npm install

CMD ["/bin/bash", "-c", "npm run start"]