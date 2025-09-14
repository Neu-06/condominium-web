# Comandos básicos de Git y GitHub

## 1. Clonar un repositorio

```bash
git clone https://github.com/usuario/repositorio.git
```

### 2. Ver el estado de los archivos

```bash
git status
```

### 3. Agregar archivos al área de staging

```bash
git add .
```

### 4. Hacer un commit

```bash
git commit -m "Mensaje del commit"
```

### 5. Subir cambios al repositorio remoto

```bash
git push origin main
```

### 6. Crear una nueva rama

```bash
git checkout -b nombre-de-la-rama
```

### 7. Cambiar de rama

```bash
git checkout nombre-de-la-rama
```

### 8. Traer los últimos cambios del remoto

```bash
git pull origin main
```

### 9. Ver ramas disponibles

```bash
git branch
```

### 10. Eliminar una rama local

```bash
git branch -d nombre-de-la-rama
```

---

## Comandos para correr la app después de clonar

1. Instalar dependencias:

```bash
npm install
```

2. Iniciar el servidor de desarrollo:

```bash
npm run dev
```
