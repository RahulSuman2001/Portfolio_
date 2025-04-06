from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import IntegrityError
from django.contrib.auth.models import User  # Import Django's built-in User model
import json
from .models import Users
import time
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.core.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
import pandas as pd
from .models import UploadedFile,FileResponse
from .serializers import Userse
import matplotlib.pyplot as plt
import seaborn as sns
import jwt
import datetime
import io
from django.shortcuts import get_object_or_404
from rest_framework import status
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures

def validate_file_extension(file):
    allowed_extensions = ['csv', 'xls', 'xlsx']
    if not file.name.split('.')[-1] in allowed_extensions:
        raise ValidationError("Only Excel or CSV files are allowed.")

#<------------------------------------------------------------------------------------------------------------->
@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def upload_file(request):
    """Handles Excel/CSV file uploads and saves to database"""
    if 'file' not in request.FILES:
        return Response({"message": "No file uploaded"}, status=400)

    file = request.FILES['file']

    # Validate file type

    # Save file to media/uploads/ and database
    uploaded_file = UploadedFile(file=file)  # Save in filestable
    uploaded_file.save()

    # Get the saved file path
    file_path = uploaded_file.file.path

    # Process file with Pandas
    try:
        if file.name.endswith('.csv'):
            df = pd.read_csv(file_path)
        else:
            df = pd.read_excel(file_path)

        # Preview first few rows for response
        preview_data = df.fillna("").to_json()

        file_resp = FileResponse(
            file_name=uploaded_file.file.name,
            file_data=preview_data 
)

        file_resp.save()


        return Response({
            "message": "File uploaded successfully",
            "file_id": uploaded_file.id,
            "file_name": uploaded_file.file.name,
            "file_data": preview_data
        }, status=201)
    except Exception as e:
        return Response({"message": f"Error processing file: {str(e)}"}, status=500)
 #<------------------------------------------------------------------------------------------------------------->   
@api_view(['POST']) 
def signup(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username, password = data.get('username'), data.get('password')

            # Create user with hashed password
            user = Users.objects.create(username=username,password=password)
        
            user.save()

            return JsonResponse({'message': 'Signup successful', 'user_id': user.id}, status=201)
        except IntegrityError:
            return JsonResponse({'message': 'User already exists'}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'message': 'Invalid JSON'}, status=400)
#<------------------------------------------------------------------------------------------------------------->
@api_view(['POST'])
def login(request):
    if request.method == "POST":
        try:
            data=json.loads(request.body)
            username=data.get("username")
            password=data.get("password")

            print(username)

            
            try:
                user = Users.objects.get(username=username)  # Now authentication will work
                if username==user.username and password==user.password:
                    print(password)
                    payload = {
                    "username": username,
                    "password": password,
                    "exp": int(time.time()) + 3600,
                    "privilege":user.privilege  
                    
                    }
                    token = jwt.encode(payload, "Rahul", algorithm="HS256")
                    return JsonResponse({"message": "Login successful", "token": token}, status=200)
                else:
                    print(password)
                    return JsonResponse({"message": "Invalid credentials"}, status=400)
            except:
                print("wrong")
        except json.JSONDecodeError:
            # print(password)
            return JsonResponse({"message": "Invalid JSON"}, status=400)

    return JsonResponse({"message": "Only POST requests are allowed"}, status=405)
#<------------------------------------------------------------------------------------------------------------->
@api_view(['POST'])
def dashboard(request):
    if request.method == "POST":
        try:
            data=json.loads(request.body)
            username=data.get("username")
            password=data.get("password")
            

            
            try:
                user = Users.objects.get(username=username)  # Now authentication will work
                if username==user.username and password==user.password:
                   
                    return JsonResponse({"message": "Login successful"}, status=200)
                else:
                   
                    return JsonResponse({"message": "Invalid credentials"}, status=400)
            except:
                print("wrong")
        except json.JSONDecodeError:
            # print(password)
            return JsonResponse({"message": "Invalid JSON"}, status=400)

    return JsonResponse({"message": "Only POST requests are allowed"}, status=405)
#<------------------------------------------------------------------------------------------------------------->
@api_view(['GET'])
def get_columns(request):
    """Returns column names from the last uploaded file."""
    # Assuming the last uploaded file is stored in the database
    latest_file = UploadedFile.objects.last()
    print(latest_file)

    if not latest_file:
        return Response({"message": "No uploaded file found"}, status=400)

    try:
        file_path = latest_file.file.path  # Get the full file path
        
        # Read the file using Pandas
        if latest_file.file.name.endswith('.csv'):
            df = pd.read_csv(file_path, nrows=1)  # Read only first 1 row
        else:
            df = pd.read_excel(file_path, nrows=1)

        columns = df.columns.tolist()  # Extract column names

        return Response({"columns": columns}, status=200)

    except Exception as e:
        return Response({"message": f"Error reading file: {str(e)}"}, status=500)
#<------------------------------------------------------------------------------------------------------------->
@api_view(['POST'])
def generate_visualization(request):
    """Generates a visualization based on user selection."""
    data = request.data
    file_id = data.get("file_id")
    chart_type = data.get("chartType")
    selected_columns = data.get("columns", [])

    # If file_id is not provided, get the latest uploaded file
    if not file_id:
        latest_file = UploadedFile.objects.order_by('-id').first()
        if not latest_file:
            return JsonResponse({"message": "No uploaded files found"}, status=404)
        file_id = latest_file.id

    if not chart_type or not selected_columns:
        return JsonResponse({"message": "Chart type and at least one column must be provided"}, status=400)

    # Fetch uploaded file
    try:
        uploaded_file = UploadedFile.objects.get(id=file_id)
        file_path = uploaded_file.file.path
    except UploadedFile.DoesNotExist:
        return JsonResponse({"message": "File not found"}, status=404)

    # Read data
    try:
        if file_path.endswith('.csv'):
            df = pd.read_csv(file_path)
        else:
            df = pd.read_excel(file_path)

        # Ensure selected columns exist
        missing_cols = [col for col in selected_columns if col not in df.columns]
        if missing_cols:
            return JsonResponse({"message": f"Invalid columns selected: {missing_cols}"}, status=400)

    except Exception as e:
        return JsonResponse({"message": f"Error reading file: {str(e)}"}, status=500)
    processed_data = df[selected_columns].to_dict(orient='records')
    
    return JsonResponse({"message": "Data processed successfully", "data": processed_data}, status=200)
#<------------------------------------------------------------------------------------------------------------->
@api_view(['GET'])
def user_fetch(request):   
        users = Users.objects.all()
        serializer = Userse(users, many=True)
        # print(serializer.data)
        return Response(serializer.data)
#<------------------------------------------------------------------------------------------------------------->
@api_view(['PUT'])
def update_user(request, id):
    try:
        user = Users.objects.get(id=id)
    except Users.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = Userse(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


#<------------------------------------------------------------------------------------------------------------->
@api_view(['POST'])
def delete_users(request):
    user_ids = request.data.get('ids', [])
    if not user_ids:
        return Response({"error": "No user IDs provided"}, status=status.HTTP_400_BAD_REQUEST)

    deleted_count, _ = Users.objects.filter(id__in=user_ids).delete()
    return Response({"message": f"Deleted {deleted_count} users"}, status=status.HTTP_200_OK)
#<------------------------------------------------------------------------------------------------------------->

@api_view(['POST'])
@parser_classes([MultiPartParser])
def get_pred_columns(request):
    file = request.FILES.get('file')  # safer than request.FILES['file']
    
    if not file:
        return Response({'error': 'No file provided'}, status=400)

    try:
        df = pd.read_excel(file) if file.name.endswith('.xlsx') else pd.read_csv(file)
        columns = df.columns.tolist()
        return Response({'columns': columns})
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['POST'])
@parser_classes([MultiPartParser])
def predict_view(request):
    """
    Receives file + prediction inputs, saves file, performs regression.
    Request should include:
    - file
    - x_columns (list in JSON string format)
    - y_column (string)
    - degree (optional, default 2)
    """
    try:
        file = request.FILES.get('file')
        if not file:
            return Response({"error": "No file provided."}, status=400)

        uploaded = UploadedFile.objects.create(file=file)
        file_path = uploaded.file.path

        x_columns = json.loads(request.data.get('x_columns', '[]'))
        y_column = request.data.get('y_column')
        degree = int(request.data.get('degree', 2))

        if not x_columns or not y_column:
            return Response({"error": "x_columns and y_column are required."}, status=400)

        # Read uploaded file into a DataFrame
        if file.name.endswith('.csv'):
            df = pd.read_csv(file_path)
        else:
            df = pd.read_excel(file_path)

        # Validate column existence
        for col in x_columns + [y_column]:
            if col not in df.columns:
                return Response({"error": f"Column '{col}' not found in the file."}, status=400)

        # Extract input features and target
        X = df[x_columns].values
        y = df[y_column].values

        # Apply polynomial transformation
        poly = PolynomialFeatures(degree=degree)
        X_poly = poly.fit_transform(X)

        # Handle NaNs in target
        known_mask = ~pd.isna(y)
        unknown_mask = pd.isna(y)

        if known_mask.sum() == 0:
            return Response({"error": "No known values to train the model."}, status=400)

        X_known = X_poly[known_mask]
        y_known = y[known_mask]

        model = LinearRegression()
        model.fit(X_known, y_known)

        # Predict all values (for charting)
        y_pred = model.predict(X_poly)

        # Fill the missing values in y with predicted values
        y_filled = y.copy()
        y_filled[unknown_mask] = y_pred[unknown_mask]

        return Response({
            "actual": y_filled.tolist(),  # Filled y values
            "predicted": y_pred.tolist(),  # All predictions
            "x": df[x_columns].to_dict(orient='records')
        })

    except Exception as e:
        return Response({"error": str(e)}, status=500)
