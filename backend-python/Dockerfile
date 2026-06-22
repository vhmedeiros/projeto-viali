FROM python:3.11-alpine

WORKDIR /app

# instala dependencias do sistema necessarias para algumas libs Python
# algumas precisam de compiladores C, como numpy
RUN apk add --no-cache gcc musl-dev libffi-dev

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8001

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001", "--reload"]