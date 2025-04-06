"""
URL configuration for Finance_tracker project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path
from .quickstart.views import upload_file
from .quickstart.views import signup, login,predict_view
from .quickstart.views import get_columns,generate_visualization,user_fetch,delete_users,update_user,get_pred_columns


urlpatterns = [
    path('signup/', signup),
    path('login/', login),
    path('predict/', predict_view, name='predict'),
    path('api/upload-file/', upload_file, name='upload_file'),
    path('columns/', get_columns, name='columns'),
     path('api/get_pred_columns/', get_pred_columns, name='get_pred_columns'),
    path('generate-visualization/', generate_visualization, name='generate_visualization'),
    path('users/', user_fetch, name='user_fetch'),
    path('userupdate/<int:id>/', update_user, name='update_user'),
    path('userdelete/', delete_users, name='delete_users'),

]
