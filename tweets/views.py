from django.http import HttpResponse, Http404, JsonResponse
from django.shortcuts import render, redirect
from django.utils.http import is_safe_url
from django.conf import settings

from rest_framework.response import Response
from rest_framework.decorators import api_view
from .forms import TweetForm
from .models import Tweet
from .serializers import TweetSerializer

import random

ALLOWED_HOSTS = settings.ALLOWED_HOSTS

# Create your views here.
def home_view(request, *args, **kwargs):
    # return HttpResponse("<h1>Hello World</h1>")
    return render(request, "pages/home.html", context={}, status=200)

################################################################
############### DJANGO REST FRAMEWORK VIEWS ####################
################################################################

@api_view(['POST']) # HTTP method the client == POST
def tweet_create_view(request, *args, **kwargs):
    serializer = TweetSerializer(data=request.POST or None)
    if serializer.is_valid(raise_exception=True):
        serializer.save(user=request.user)
        return Response(serializer.data, status=201)
    return Response({}, status=400)

@api_view(['GET'])
def tweet_list_view(request, *args, **kwargs):
    qs = Tweet.objects.all()
    serializer = TweetSerializer(qs, many=True)
    return Response(serializer.data, status=200)

@api_view(['GET'])
def tweet_detail_view(request, tweet_id, *args, **kwargs):
    qs = Tweet.objects.filter(id=tweet_id)
    if not qs.exists():
        return Response({}, status=404)
    obj = qs.first()
    serializer = TweetSerializer(obj)
    return Response(serializer.data, status=200)

################################################################
#################### PURE DJANGO VIEWS #########################
################################################################

def tweet_create_view_pure_django(request, *args, **kwargs):
    '''
    REST API Create View -> DRF (Django Rest Framework)
    '''
    user = request.user
    if not request.user.is_authenticated:
        user = None
        if request.is_ajax():
            return JsonResponse({}, status=401)
        return redirect(settings.LOGIN_URL)
    form = TweetForm(request.POST or None)
    next_url = request.POST.get("next") or None
    if form.is_valid():
        obj = form.save(commit=False)
        # Do other form related logic
        obj.user = user
        obj.save()
        if request.is_ajax():
            return JsonResponse(obj.serialize(), status=201) # 201 == Created Items
        if next_url != None and is_safe_url(next_url, ALLOWED_HOSTS):
            return redirect(next_url)
        form = TweetForm()
    if form.errors:
        if request.is_ajax():
            return JsonResponse(form.errors, status=400)
    return render(request, 'components/form.html', context={"form": form})

def tweet_list_view_pure_django(request, *args, **kwargs):
    '''
    REST API VIEW
    Consume by JavaScript or Swift/Java/iOS/Android 
    rest json data
    '''
    qs = Tweet.objects.all()
    tweet_list = [x.serialize() for x in qs]
    data = {
        "isUser": False,
        "response": tweet_list
    }
    return JsonResponse(data)

def tweet_detail_view_pure_django(request, tweet_id, *args, **kwargs):
    '''
    REST API VIEW
    Consume by JavaScript or Swift/Java/iOS/Android 
    rest json data
    '''
    data = {
        "id": tweet_id,
    }
    status = 200
    try:
        obj = Tweet.objects.get(id=tweet_id)
        data['content'] = obj.content
    except:
        data['message'] = "Not found"
        status = 404 
    
    # return HttpResponse(f"<h1>Hello {tweet_id} - {obj.content} </h1>")
    return JsonResponse(data, status=status) # json.dumps content_type='application/json'
