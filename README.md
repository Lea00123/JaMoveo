# JaMoveo - Sharing Music Sessions 🎸

- App is deployed using heroku (node.js server), heroku JawsDB MySQL (database) and Netlify (React client)
- Production url: https://jamoveo-lea.netlify.app/

### Installation

1. Clone the repository:

```
git clone https://github.com/Lea00123/jamoveo.git
```

2. Preapre dev environemt


On JaMoveo/frontend/.env set
```
REACT_APP_API_URL=http://localhost:5000
```
If you have your own mysql account add your credentials on JaMoveo/backend/.env
```
DB_HOST=YOUR_DB_HOST
DB_USER=YOUR_DB_USER
DB_PASSWORD=YOUR_DB_PASSWORD
DB_NAME=YOUR_DB_NAME
```

4. Install server packages:

```
cd JaMoveo/backend
npm install
```

4. Install frontend packages:

```
cd JaMoveo/frontend
npm install
```


### Activate developent environment

1. Activate server:

Make sure port 5000 is available
```
cd JaMoveo/backend
npm start
```
The server will run on http://localhost:5000

2. Activate frontend:

```
cd JaMoveo/frontend
npm start
```
Open your browser at http://localhost:3000

