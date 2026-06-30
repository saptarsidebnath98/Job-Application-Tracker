## Registration
```
/register
    |
Validate name, email, password
    |
Check if email already exists
    |
    ├── Yes
    |      |
    |   Return 409 Conflict
    |
    └── No
           |
bcrypt.hash(password)
           |
Store name, email, hashed password
           |
Return 201 Created
```

## Login
```
/login
    |
Validate email, password
    |
Find user by email
    |
    ├── User not found
    |      |
    |   Return 401
    |
    └── User found
           |
Retrieve hashed password
           |
bcrypt.compare(password, hashedPassword)
           |
    ├── Invalid
    |      |
    |   Return 401
    |
    └── Valid
           |
jwt.sign({ id })
           |
Return accessToken
```

## Protected Route (/jobs)
```
/jobs
    |
Read Authorization Header
    |
Header starts with "Bearer "?
    |
Extract accessToken
    |
jwt.verify(accessToken)
    |
Get userId
    |
req.userId = userId
    |
SELECT * FROM jobs
WHERE user_id = req.userId
    |
Return jobs
```