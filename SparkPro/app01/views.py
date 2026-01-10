import requests
from rest_framework.views import APIView
from rest_framework.response import Response


class InfoView(APIView):
    def get(self, request):
        
        resp = requests.get('http://ip-api.com/json/?lang=zh-CN', timeout=120)
        ip = resp.json().get('query', '') or ''
        user_agent = request.META.get('HTTP_USER_AGENT') or ''

        return Response({"ip": ip, "user_agent": user_agent})
