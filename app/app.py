
from flask import Flask, render_template
import psycopg2
from psycopg2 import Error

try:
    connection = psycopg2.connect(user="root",
                                  password="3B_dataanalytics",
                                  host="mypostgresdb.cd98u61l7amw.ap-southeast-2.rds.amazonaws.com",
                                  port="5432",
                                  database="postgres")

    cursor = connection.cursor() 
    postgreSQL_select_Query = "select * from heartfailure;"
    cursor.execute(postgreSQL_select_Query);
    print("Selecting rows from heartfailure table using cursor.fetchone")

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