
from flask import Flask, render_template
# from sqlalchemy import create_engine
import psycopg2
from psycopg2 import Error

try:
    connection = psycopg2.connect(user="root",
                                  password="3B_dataanalytics",
                                  host="mypostgresdb.cd98u61l7amw.ap-southeast-2.rds.amazonaws.com",
                                  port="5432",
                                  database="postgres")

# connection_string = "root:3B_dataanalytics@mypostgresdb.cd98u61l7amw.ap-southeast-2.rds.amazonaws.com:5432/postgres"
# engine = create_engine(f'postgresql://{connection}')
    cursor = connection.cursor() 
    postgreSQL_select_Query = "select * from heartfailure;"
    print("Selecting rows from heartfailure table using cursor.fetchone")
    # Create a cursor to perform database operations

    record = cursor.fetchone()
    print("You are connected to - ", record, "\n")

except (Exception, Error) as error:
        print("Error while connecting to PostgreSQL", error)
finally:
    if (connection):
        cursor.close()
        connection.close()
        print("PostgreSQL connection is closed")
app = Flask(__name__)
  
@app.route("/")
def home_view():
        return render_template("index.html")