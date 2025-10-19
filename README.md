

## نظام المصادقة (Authentication System)
```
https://pawsh-pets-back-end-api.vercel.app
```
يوفر نظام المصادقة هذا طريقة آمنة ومرنة لإدارة وصول المستخدمين إلى تطبيقك، ويدعم كلاً من تطبيقات الويب (باستخدام الكوكيز) وتطبيقات الموبايل (باستخدام التوكنات في جسم الاستجابة أو رأس الترويسة).

### 1. تسجيل مستخدم جديد (Register User)

تتيح هذه الوظيفة للمستخدمين إنشاء حسابات جديدة في النظام.

-   **المسار (Endpoint):** `POST /api/auth/register`
-   **البيانات المطلوبة (Request Body):**
    ```json
    {
        "username": "اسم المستخدم",
        "email": "البريد الإلكتروني",
        "password": "كلمة المرور"
    }
    ```
-   **الاستجابة الناجحة (Success Response - Status 201 Created):**
    ```json
    {
        "message": "User registered successfully",
        "user": {
            "id": "معرف المستخدم",
            "username": "اسم المستخدم",
            "email": "البريد الإلكتروني",
            "createdAt": "تاريخ الإنشاء"
        }
    }
    ```
-   **الاستجابة عند وجود خطأ (Error Response - Status 400 Bad Request / 409 Conflict / 500 Server Error):**
    ```json
    {
        "message": "All fields are required" // أو "Email already registered" أو "Server error"
    }
    ```

#### أمثلة الكود:

**Flutter (Mobile):**

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;

Future<void> registerUser(String username, String email, String password) async {
  final url = Uri.parse('YOUR_API_BASE_URL/api/auth/register');
  try {
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: json.encode({
        'username': username,
        'email': email,
        'password': password,
      }),
    );

    if (response.statusCode == 201) {
      print('Registration successful: ${response.body}');
    } else {
      print('Registration failed: ${response.statusCode} - ${response.body}');
      throw Exception('Failed to register user');
    }
  } catch (e) {
    print('Error during registration: $e');
    throw Exception('Failed to connect to the server');
  }
}
```

**React (Frontend - Fetch API):**

```javascript
async function registerUser(username, email, password) {
  try {
    const response = await fetch('YOUR_API_BASE_URL/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Registration successful:', data);
      return data;
    } else {
      console.error('Registration failed:', data.message);
      throw new Error(data.message || 'Failed to register user');
    }
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
}
```

**React (Frontend - Axios):**

```javascript
import axios from 'axios';

async function registerUser(username, email, password) {
  try {
    const response = await axios.post('YOUR_API_BASE_URL/api/auth/register', {
      username, email, password
    });
    console.log('Registration successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error during registration:', error.response ? response.data.message : error.message);
    throw error.response ? error.response.data.message : error.message;
  }
}
```

### 2. تسجيل الدخول (Login User)

تسمح للمستخدمين الحاليين بالوصول إلى حساباتهم والحصول على توكنات المصادقة.

-   **المسار (Endpoint):** `POST /api/auth/login`
-   **البيانات المطلوبة (Request Body):**
    ```json
    {
        "email": "البريد الإلكتروني",
        "password": "كلمة المرور",
        "client": "web" // أو "mobile"
    }
    ```
-   **الاستجابة الناجحة (Success Response - Status 200 OK):**
    -   **لتطبيقات الويب (`client: "web"`):** يتم تعيين `accessToken` و `refreshToken` كـ `HTTP-only cookies`.
        ```json
        {
            "message": "Login successful (web)",
            "user": {
                "id": "معرف المستخدم",
                "username": "اسم المستخدم",
                "email": "البريد الإلكتروني"
            }
        }
        ```
    -   **لتطبيقات الموبايل (`client: "mobile"`):** يتم إرجاع `accessToken` و `refreshToken` في جسم الاستجابة.
        ```json
        {
            "message": "Login successful (mobile)",
            "tokens": {
                "accessToken": "توكن الوصول",
                "refreshToken": "توكن التحديث"
            },
            "user": {
                "id": "معرف المستخدم",
                "username": "اسم المستخدم",
                "email": "البريد الإلكتروني"
            }
        }
        ```
-   **الاستجابة عند وجود خطأ (Error Response - Status 400 Bad Request / 401 Unauthorized / 500 Server Error):**
    ```json
    {
        "message": "Email and password are required" // أو "Invalid credentials" أو "Server error"
    }
    ```

#### أمثلة الكود:

**Flutter (Mobile):**

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;

Future<Map<String, dynamic>> loginUser(String email, String password) async {
  final url = Uri.parse('YOUR_API_BASE_URL/api/auth/login');
  try {
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: json.encode({
        'email': email,
        'password': password,
        'client': 'mobile',
      }),
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      print('Login successful: $data');
      // حفظ التوكنات محليًا (مثلاً باستخدام shared_preferences أو flutter_secure_storage)
      // final String accessToken = data['tokens']['accessToken'];
      // final String refreshToken = data['tokens']['refreshToken'];
      return data;
    } else {
      print('Login failed: ${response.statusCode} - ${response.body}');
      throw Exception('Failed to login');
    }
  } catch (e) {
    print('Error during login: $e');
    throw Exception('Failed to connect to the server');
  }
}
```

**React (Frontend - Fetch API):**

```javascript
async function loginUser(email, password) {
  try {
    const response = await fetch('YOUR_API_BASE_URL/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, client: 'web' }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Login successful:', data);
      // Access tokens are set as HTTP-only cookies by the server
      return data;
    } else {
      console.error('Login failed:', data.message);
      throw new Error(data.message || 'Failed to login');
    }
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
}
```

**React (Frontend - Axios):**

```javascript
import axios from 'axios';

async function loginUser(email, password) {
  try {
    const response = await axios.post('YOUR_API_BASE_URL/api/auth/login', {
      email, password, client: 'web'
    }, {
      withCredentials: true // مهم لإرسال واستقبال الكوكيز
    });
    console.log('Login successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error during login:', error.response ? error.response.data.message : error.message);
    throw error.response ? error.response.data.message : error.message;
  }
}
```

### 3. تحديث توكن الوصول (Refresh Access Token)

تسمح هذه الوظيفة بتجديد `accessToken` منتهي الصلاحية باستخدام `refreshToken`، مما يضمن استمرارية جلسة المستخدم دون الحاجة لإعادة تسجيل الدخول.

-   **المسار (Endpoint):** `POST /api/auth/refresh-token`
-   **البيانات المطلوبة (Request Body):**
    -   **لتطبيقات الويب (`client: "web"`):** يتم إرسال `refreshToken` تلقائيًا كـ `HTTP-only cookie`.
        ```json
        {
            "client": "web"
        }
        ```
    -   **لتطبيقات الموبايل (`client: "mobile"`):** يتم إرسال `refreshToken` في جسم الطلب أو في رأس `Authorization`.
        ```json
        {
            "client": "mobile",
            "refreshToken": "توكن التحديث"
        }
        ```
        أو في رأس الترويسة:
        `Authorization: Bearer <refreshToken>`

-   **الاستجابة الناجحة (Success Response - Status 200 OK):**
    -   **لتطبيقات الويب (`client: "web"`):** يتم تعيين `newAccessToken` كـ `HTTP-only cookie`.
        ```json
        {
            "message": "Access token refreshed (web)"
        }
        ```
    -   **لتطبيقات الموبايل (`client: "mobile"`):** يتم إرجاع `newAccessToken` في جسم الاستجابة.
        ```json
        {
            "message": "Access token refreshed (mobile)",
            "accessToken": "توكن الوصول الجديد"
        }
        ```
-   **الاستجابة عند وجود خطأ (Error Response - Status 401 Unauthorized / 500 Server Error):**
    ```json
    {
        "message": "No refresh token provided" // أو "Refresh token expired" أو "Invalid refresh token" أو "Server error"
    }
    ```

#### أمثلة الكود:

**Flutter (Mobile):**

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;

Future<String> refreshAccessToken(String refreshToken) async {
  final url = Uri.parse('YOUR_API_BASE_URL/api/auth/refresh-token');
  try {
    final response = await http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $refreshToken', // إرسال التوكن في الهيدر
      },
      body: json.encode({
        'client': 'mobile',
      }),
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      print('Access token refreshed: ${data['accessToken']}');
      // حفظ توكن الوصول الجديد محليًا
      return data['accessToken'];
    } else {
      print('Refresh token failed: ${response.statusCode} - ${response.body}');
      throw Exception('Failed to refresh access token');
    }
  } catch (e) {
    print('Error during token refresh: $e');
    throw Exception('Failed to connect to the server');
  }
}
```

**React (Frontend - Fetch API):**

```javascript
async function refreshAccessToken() {
  try {
    const response = await fetch('YOUR_API_BASE_URL/api/auth/refresh-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // مهم لإرسال واستقبال الكوكيز
      body: JSON.stringify({ client: 'web' }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Access token refreshed (web):', data.message);
      // New access token is set as HTTP-only cookie by the server
      return data;
    } else {
      console.error('Refresh token failed:', data.message);
      throw new Error(data.message || 'Failed to refresh access token');
    }
  } catch (error) {
    console.error('Error during token refresh:', error);
    throw error;
  }
}
```

**React (Frontend - Axios):**

```javascript
import axios from 'axios';

async function refreshAccessToken() {
  try {
    const response = await axios.post('YOUR_API_BASE_URL/api/auth/refresh-token', {
      client: 'web'
    }, {
      withCredentials: true // مهم لإرسال واستقبال الكوكيز
    });
    console.log('Access token refreshed (web):', response.data.message);
    return response.data;
  } catch (error) {
    console.error('Error during token refresh:', error.response ? error.response.data.message : error.message);
    throw error.response ? error.response.data.message : error.message;
  }
}
```

### 4. التحقق من توكن الوصول (Verify Access Token)

تستخدم هذه الوظيفة للتحقق من صلاحية `accessToken` الحالي، وهي مفيدة لحماية المسارات التي تتطلب مصادقة.

-   **المسار (Endpoint):** `POST /api/auth/verify-token`
-   **البيانات المطلوبة (Request Body):**
    -   **لتطبيقات الويب (`client: "web"`):** يتم إرسال `accessToken` تلقائيًا كـ `HTTP-only cookie`.
        ```json
        {
            "client": "web"
        }
        ```
    -   **لتطبيقات الموبايل (`client: "mobile"`):** يتم إرسال `accessToken` في جسم الطلب أو في رأس `Authorization`.
        ```json
        {
            "client": "mobile",
            "accessToken": "توكن الوصول"
        }
        ```
        أو في رأس الترويسة:
        `Authorization: Bearer <accessToken>`

-   **الاستجابة الناجحة (Success Response - Status 200 OK):**
    ```json
    {
        "valid": true,
        "user": {
            "id": "معرف المستخدم",
            "username": "اسم المستخدم",
            "email": "البريد الإلكتروني"
        }
    }
    ```
-   **الاستجابة عند وجود خطأ (Error Response - Status 401 Unauthorized):**
    ```json
    {
        "valid": false,
        "message": "No access token provided" // أو "Access token expired" أو "Invalid access token"
    }
    ```

#### أمثلة الكود:

**Flutter (Mobile):**

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;

Future<bool> verifyAccessToken(String accessToken) async {
  final url = Uri.parse('YOUR_API_BASE_URL/api/auth/verify-token');
  try {
    final response = await http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $accessToken', // إرسال التوكن في الهيدر
      },
      body: json.encode({
        'client': 'mobile',
      }),
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      print('Token verification successful: ${data['valid']}');
      return data['valid'];
    } else {
      print('Token verification failed: ${response.statusCode} - ${response.body}');
      return false;
    }
  } catch (e) {
    print('Error during token verification: $e');
    return false;
  }
}
```

**React (Frontend - Fetch API):**

```javascript
async function verifyAccessToken() {
  try {
    const response = await fetch('YOUR_API_BASE_URL/api/auth/verify-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ client: 'web' }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Token verification successful:', data.valid);
      return data.valid;
    } else {
      console.error('Token verification failed:', data.message);
      return false;
    }
  } catch (error) {
    console.error('Error during token verification:', error);
    return false;
  }
}
```

**React (Frontend - Axios):**

```javascript
import axios from 'axios';

async function verifyAccessToken() {
  try {
    const response = await axios.post('YOUR_API_BASE_URL/api/auth/verify-token', {
      client: 'web'
    }, {
      withCredentials: true // مهم لإرسال واستقبال الكوكيز
    });
    console.log('Token verification successful:', response.data.valid);
    return response.data.valid;
  } catch (error) {
    console.error('Error during token verification:', error.response ? error.response.data.message : error.message);
    return false;
  }
}
```

### 5. تسجيل الخروج (Logout User)

تسمح للمستخدمين بإنهاء جلستهم الحالية.

-   **المسار (Endpoint):** `POST /api/auth/logout`
-   **البيانات المطلوبة (Request Body):**
    ```json
    {
        "client": "web" // أو "mobile"
    }
    ```
-   **الاستجابة الناجحة (Success Response - Status 200 OK):**
    -   **لتطبيقات الويب (`client: "web"`):** يتم مسح `accessToken` و `refreshToken` من الكوكيز.
        ```json
        {
            "message": "Logged out successfully (web)"
        }
        ```
    -   **لتطبيقات الموبايل (`client: "mobile"`):** يتم إرجاع رسالة تفيد بضرورة مسح التوكنات محليًا.
        ```json
        {
            "message": "Logged out successfully (mobile). Please remove tokens locally"
        }
        ```
-   **الاستجابة عند وجود خطأ (Error Response - Status 500 Server Error):**
    ```json
    {
        "message": "Server error"
    }
    ```

#### أمثلة الكود:

**Flutter (Mobile):**

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;

Future<void> logoutUser() async {
  final url = Uri.parse('YOUR_API_BASE_URL/api/auth/logout');
  try {
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: json.encode({
        'client': 'mobile',
      }),
    );

    if (response.statusCode == 200) {
      print('Logout successful: ${response.body}');
      // مسح التوكنات المحفوظة محليًا (accessToken و refreshToken)
    } else {
      print('Logout failed: ${response.statusCode} - ${response.body}');
      throw Exception('Failed to logout');
    }
  } catch (e) {
    print('Error during logout: $e');
    throw Exception('Failed to connect to the server');
  }
}
```

**React (Frontend - Fetch API):**

```javascript
async function logoutUser() {
  try {
    const response = await fetch('YOUR_API_BASE_URL/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ client: 'web' }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Logout successful:', data.message);
      // Cookies are cleared by the server
      return data;
    } else {
      console.error('Logout failed:', data.message);
      throw new Error(data.message || 'Failed to logout');
    }
  } catch (error) {
    console.error('Error during logout:', error);
    throw error;
  }
}
```

**React (Frontend - Axios):**

```javascript
import axios from 'axios';

async function logoutUser() {
  try {
    const response = await axios.post('YOUR_API_BASE_URL/api/auth/logout', {
      client: 'web'
    }, {
      withCredentials: true // مهم لإرسال واستقبال الكوكيز
    });
    console.log('Logout successful:', response.data.message);
    return response.data;
  } catch (error) {
    console.error('Error during logout:', error.response ? error.response.data.message : error.message);
    throw error.response ? error.response.data.message : error.message;
  }
}
```
## المصادقة باستخدام جوجل (Google Authentication)

تتيح المصادقة باستخدام جوجل للمستخدمين تسجيل الدخول إلى تطبيقك باستخدام حساباتهم على جوجل، مما يوفر تجربة تسجيل دخول سلسة وآمنة. يعتمد هذا الأسلوب على الحصول على `ID Token` من جوجل في الواجهة الأمامية (Flutter أو React) ثم إرساله إلى الخادم الخلفي (Backend) للتحقق منه وإنشاء جلسة للمستخدم.

### 1. المتطلبات الأساسية والإعدادات

قبل البدء، ستحتاج إلى:

1.  **مشروع جوجل في Google Cloud Console:**
    *   انتقل إلى <mcurl name="Google Cloud Console" url="https://console.cloud.google.com/"></mcurl>.
    *   أنشئ مشروعًا جديدًا أو استخدم مشروعًا موجودًا.
    *   قم بتمكين `Google People API` و `Google Identity Platform API`.
    *   انتقل إلى `APIs & Services > Credentials`.
    *   أنشئ `OAuth 2.0 Client ID` لنوع التطبيق `Web application` (حتى لو كان لموبايل، ستحتاج هذا لـ `client ID` و `client secret` في بعض الحالات أو لـ `ID Token` نفسه).
    *   أنشئ `OAuth 2.0 Client ID` لنوع التطبيق `Android` و `iOS` إذا كنت تعمل على Flutter.
    *   احصل على `Client ID` الخاص بك. هذا المعرف ضروري لتطبيقات الواجهة الأمامية.

2.  **نقطة نهاية (Endpoint) في الخادم الخلفي:**
    لقد قمت بالفعل بتوفير نقطة نهاية في الخادم الخلفي للتعامل مع `Google ID Token`. المسار هو `POST /api/auth/google`.
    تتوقع هذه النقطة `ID Token` في جسم الطلب:
    ```json
    {
        "token": "Google ID Token"
    }
    ```
    وستقوم بالتحقق من التوكن، وإنشاء مستخدم جديد إذا لم يكن موجودًا، ثم إرجاع `accessToken` الخاص بتطبيقك وبيانات المستخدم.

### 2. تطبيق Flutter (Mobile)

لاستخدام Google Sign-In في Flutter، ستحتاج إلى إضافة حزمة `google_sign_in`.

#### أ. إضافة التبعية (Dependency)

أضف `google_sign_in` إلى ملف `pubspec.yaml`:

```yaml:pubspec.yaml
dependencies:
  flutter:
    sdk: flutter
  google_sign_in: ^6.1.0 # تأكد من استخدام أحدث إصدار
  http: ^1.1.0 # إذا لم تكن موجودة
```

ثم قم بتشغيل `flutter pub get`.

#### ب. إعدادات Android و iOS

**Android:**
*   تأكد من أن لديك ملف `google-services.json` في مجلد `android/app/`. يمكنك الحصول عليه من Firebase Console بعد ربط مشروعك بـ Google.
*   في ملف `android/app/build.gradle`، تأكد من تطبيق المكون الإضافي `com.google.gms.google-services`:
    ```gradle:android/app/build.gradle
    // ... existing code ...
    apply plugin: 'com.android.application'
    apply plugin: 'com.google.gms.google-services' // أضف هذا السطر
    // ... existing code ...
    ```

**iOS:**
*   افتح مشروعك في Xcode.
*   أضف `URL Scheme` لـ `Reverse Client ID` الخاص بك. يمكنك العثور على `Reverse Client ID` في ملف `GoogleService-Info.plist` (الذي تحصل عليه من Firebase Console).
*   في Xcode، انتقل إلى `Runner > Info > URL Types` وأضف `URL Scheme` جديدًا.

#### ج. مثال الكود (Flutter)

```dart
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:http/http.dart' as http;

// تهيئة GoogleSignIn
final GoogleSignIn _googleSignIn = GoogleSignIn(
  scopes: [
    'email',
    // 'https://www.googleapis.com/auth/contacts.readonly', // أضف نطاقات إضافية إذا لزم الأمر
  ],
);

Future<void> signInWithGoogleFlutter() async {
  try {
    // تسجيل الدخول باستخدام جوجل
    final GoogleSignInAccount? googleUser = await _googleSignIn.signIn();

    if (googleUser == null) {
      // المستخدم ألغى عملية تسجيل الدخول
      print('Google Sign-In cancelled.');
      return;
    }

    // الحصول على تفاصيل المصادقة (بما في ذلك ID Token)
    final GoogleSignInAuthentication googleAuth = await googleUser.authentication;
    final String? idToken = googleAuth.idToken;

    if (idToken == null) {
      print('Failed to get Google ID Token.');
      return;
    }

    print('Google ID Token: $idToken');

    // إرسال ID Token إلى الخادم الخلفي الخاص بك
    final url = Uri.parse('YOUR_API_BASE_URL/api/auth/google');
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: json.encode({'token': idToken}),
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      print('Backend authentication successful: $data');
      // هنا يمكنك حفظ accessToken الخاص بك (data['accessToken'])
      // وتوجيه المستخدم إلى الشاشة الرئيسية
    } else {
      print('Backend authentication failed: ${response.statusCode} - ${response.body}');
      // التعامل مع الأخطاء من الخادم الخلفي
    }
  } catch (error) {
    print('Error during Google Sign-In: $error');
    // التعامل مع أخطاء الاتصال أو جوجل
  }
}

// مثال على كيفية استدعاء الوظيفة (يمكن وضعها في زر)
class GoogleSignInButton extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: signInWithGoogleFlutter,
      child: Text('Sign in with Google'),
    );
  }
}
```

### 3. تطبيق React (Frontend)

لاستخدام Google Sign-In في React، يمكنك استخدام مكتبة `react-google-oauth` أو `react-google-login` (إذا كنت تستخدم الإصدارات القديمة من Google Sign-In) أو ببساطة استخدام `Google Identity Services` مباشرة. سنركز على `Google Identity Services` لأنه النهج الموصى به حاليًا.

#### أ. إضافة مكتبة Google Identity Services

أضف السكريبت التالي إلى ملف `index.html` الخاص بك (داخل `<head>` أو قبل إغلاق `</body>`):

```html:public/index.html
<!-- ... existing code ... -->
<script src="https://accounts.google.com/gsi/client" async defer></script>
<!-- ... existing code ... -->
```

#### ب. مثال الكود (React - باستخدام Fetch API)

```javascript
import React, { useEffect } from 'react';

const GoogleAuthButton = () => {
  const handleCredentialResponse = async (response) => {
    console.log("Encoded JWT ID token: " + response.credential);
    const idToken = response.credential;

    try {
      const backendResponse = await fetch('YOUR_API_BASE_URL/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: idToken }),
      });

      const data = await backendResponse.json();

      if (backendResponse.ok) {
        console.log('Backend authentication successful:', data);
        // هنا يمكنك حفظ accessToken الخاص بك (data.accessToken)
        // وتوجيه المستخدم إلى الشاشة الرئيسية
      } else {
        console.error('Backend authentication failed:', data.error || data.message);
        // التعامل مع الأخطاء من الخادم الخلفي
      }
    } catch (error) {
      console.error('Error sending ID token to backend:', error);
      // التعامل مع أخطاء الشبكة
    }
  };

  useEffect(() => {
    // تهيئة Google Sign-In
    window.google.accounts.id.initialize({
      client_id: "YOUR_GOOGLE_CLIENT_ID", // استبدل بمعرف العميل الخاص بك
      callback: handleCredentialResponse,
    });

    // عرض زر تسجيل الدخول
    window.google.accounts.id.renderButton(
      document.getElementById("google-sign-in-button"),
      { theme: "outline", size: "large" } // تخصيص مظهر الزر
    );

    // إذا كنت تريد تسجيل الدخول التلقائي (اخياري)
    // window.google.accounts.id.prompt();
  }, []);

  return (
    <div>
      <div id="google-sign-in-button"></div>
    </div>
  );
};

export default GoogleAuthButton;
```

#### ج. مثال الكود (React - باستخدام Axios)

```javascript
import React, { useEffect } from 'react';
import axios from 'axios';

const GoogleAuthButtonAxios = () => {
  const handleCredentialResponse = async (response) => {
    console.log("Encoded JWT ID token: " + response.credential);
    const idToken = response.credential;

    try {
      const backendResponse = await axios.post('YOUR_API_BASE_URL/api/auth/google', {
        token: idToken,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Backend authentication successful:', backendResponse.data);
      // هنا يمكنك حفظ accessToken الخاص بك (backendResponse.data.accessToken)
      // وتوجيه المستخدم إلى الشاشة الرئيسية
    } catch (error) {
      console.error('Error sending ID token to backend:', error.response ? error.response.data.error || error.response.data.message : error.message);
      // التعامل مع الأخطاء من الخادم الخلفي أو أخطاء الشبكة
    }
  };

  useEffect(() => {
    window.google.accounts.id.initialize({
      client_id: "YOUR_GOOGLE_CLIENT_ID", // استبدل بمعرف العميل الخاص بك
      callback: handleCredentialResponse,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("google-sign-in-button-axios"),
      { theme: "outline", size: "large" }
    );
  }, []);

  return (
    <div>
      <div id="google-sign-in-button-axios"></div>
    </div>
  );
};

export default GoogleAuthButtonAxios;
```

### 4. التعامل مع استجابة الخادم الخلفي

بعد أن يرسل الواجهة الأمامية `ID Token` إلى الخادم الخلفي، سيعود الخادم باستجابة تحتوي على `accessToken` الخاص بتطبيقك وبيانات المستخدم.

*   **حفظ `accessToken`:**
    *   **Flutter:** قم بحفظ `accessToken` (و `refreshToken` إذا كان الخادم يرجعه) في مكان آمن مثل `shared_preferences` أو `flutter_secure_storage`.
    *   **React:** قم بحفظ `accessToken` في `localStorage` أو `sessionStorage` أو في سياق (Context) أو مخزن (Store) لإدارة الحالة (مثل Redux أو Zustand).

*   **توجيه المستخدم:**
    بعد حفظ التوكن، قم بتوجيه المستخدم إلى الشاشة الرئيسية أو لوحة التحكم الخاصة به.

### 5. معالجة الأخطاء

من المهم التعامل مع الأخطاء في كل خطوة:

*   **أخطاء Google Sign-In:** قد يفشل تسجيل الدخول بسبب إلغاء المستخدم، أو مشاكل في الشبكة، أو إعدادات غير صحيحة.
*   **أخطاء الخادم الخلفي:** قد يرفض الخادم الخلفي `ID Token` إذا كان غير صالح أو منتهي الصلاحية، أو إذا حدث خطأ داخلي في الخادم.
*   **أخطاء الشبكة:** تأكد من التعامل مع حالات عدم الاتصال بالإنترنت.

باستخدام هذه الإرشادات وأمثلة الكود، يمكن لمطوري Flutter و React دمج Google Authentication بنجاح في تطبيقاتهم.

 ---

# 🐾 Animal API – Documentation

هذا المستند يوضح كيفية التعامل مع **API الخاص بالحيوانات** سواء من جانب **React** أو **Flutter**.

---

## 📌 نموذج البيانات (Schema)

### الحقول الأساسية

| الحقل | النوع | مطلوب | القيم المتاحة | الوصف | مثال |
|-------|--------|--------|----------------|--------|-------|
| `photo` | `file` | ✅ | - | ملف صورة الحيوان (يرسل مع FormData) | `animal.jpg` |
| `type` | `string` | ✅ | - | نوع الحيوان (مثلاً: كلب، قطة) | `"dog"` |
| `name` | `string` | ✅ | - | اسم الحيوان | `"Rocky"` |
| `breedOrSpecies` | `string` | ✅ | - | السلالة أو النوع | `"German Shepherd"` |
| `age` | `number` | ✅ | - | العمر (بالسنوات أو الشهور) | `3` |
| `weight` | `number` | ✅ | - | الوزن بالكيلو جرام | `15` |
| `gender` | `enum` | ✅ | `"male"`, `"female"`, `"unknown"` | جنس الحيوان | `"male"` |
| `identifyingFeatures` | `string` | ❌ | - | علامات مميزة (ندوب، ألوان، إلخ) | `"White spot on left ear"` |
| `healthConsiderations` | `string` | ❌ | - | مشاكل صحية | `"Diabetic"` |
| `dietaryNeeds` | `string` | ❌ | - | متطلبات غذائية خاصة | `"Grain-free diet"` |
| `behaviorAndTemperament` | `string` | ❌ | - | السلوك والطباع | `"Friendly with kids"` |
| `activityLevel` | `enum` | ❌ | `"low"`, `"moderate"`, `"high"` | مستوى النشاط | `"high"` |

---

## 🔑 الوصول (Authorization)

> ⚠️ هذا المسار **محمي**.  
> يجب أن يكون المستخدم **مسجل دخول**، ويتم إرسال **Access Token** في الهيدر:

```http
Authorization: Bearer <your_access_token>
````

* تطبيقات **الويب**: التوكن يتم حفظه في **HTTP-only cookies** تلقائيًا.
* تطبيقات **الموبايل (Flutter)**: يجب تمرير التوكن في الهيدر يدويًا.

---

## 📤 طريقة الإرسال

> ⚠️ **يجب إرسال البيانات باستخدام `multipart/form-data` وليس JSON.**

### 🖼️ مثال React (Axios)

```tsx
import axios from "axios";

const formData = new FormData();
formData.append("photo", file); // ملف من input[type=file]
formData.append("type", "dog");
formData.append("name", "Rocky");
formData.append("breedOrSpecies", "German Shepherd");
formData.append("age", "3");
formData.append("weight", "15");
formData.append("gender", "male");

await axios.post("http://your-backend-url/api/animals", formData, {
  headers: {
    "Content-Type": "multipart/form-data",
    "Authorization": "Bearer YOUR_ACCESS_TOKEN", // مهم
  },
  withCredentials: true, // للويب: لإرسال الكوكيز
});
```

---

### 📱 مثال Flutter (Dio)

```dart
import 'package:dio/dio.dart';

FormData formData = FormData.fromMap({
  "photo": await MultipartFile.fromFile(
    imageFile.path,
    filename: "animal.jpg",
  ),
  "type": "dog",
  "name": "Rocky",
  "breedOrSpecies": "German Shepherd",
  "age": "3",
  "weight": "15",
  "gender": "male",
});

await Dio().post(
  "http://your-backend-url/api/animals",
  data: formData,
  options: Options(
    headers: {
      "Content-Type": "multipart/form-data",
      "Authorization": "Bearer YOUR_ACCESS_TOKEN", // مهم
    },
  ),
);
```

---

## ✅ ملاحظات مهمة

* هذا المسار **يتطلب تسجيل دخول**، وإلا سيُرجع السيرفر خطأ `401 Unauthorized`.
* الحقول المطلوبة إجباريًا:
  `photo`, `type`, `name`, `breedOrSpecies`, `age`, `weight`, `gender`.
* الحقول الأخرى اختيارية.
* تأكد من استخدام **`multipart/form-data`** في أي عملية رفع.
* الرابط المستخدم في الأمثلة (`http://your-backend-url/api/animals`) يجب تغييره حسب السيرفر الخاص بك.

---
### 4. جلب بيانات الحيوانات الخاصة بالمستخدم (Get User's Animals Data)

تتيح هذه الوظيفة للمستخدم جلب قائمة بجميع الحيوانات التي قام بإضافتها.

-   **المسار (Endpoint):** `GET /api/animals`
-   **الترويسات المطلوبة (Required Headers):**
    *   `Authorization`: `Bearer <ACCESS_TOKEN>` (لمستخدمي الموبايل)
    *   **الكوكيز (Cookies):** `accessToken=<ACCESS_TOKEN>` (لمستخدمي الويب)
-   **الاستجابة الناجحة (Success Response - Status 200 OK):**
    ```json
    [
        {
            "_id": "معرف الحيوان",
            "user": "معرف المستخدم",
            "photo": "رابط الصورة",
            "type": "نوع الحيوان (مثال: كلب)",
            "name": "اسم الحيوان",
            "breedOrSpecies": "السلالة أو الفصيلة",
            "age": "العمر",
            "weight": "الوزن",
            "gender": "الجنس (ذكر/أنثى/غير معروف)",
            "identifyingFeatures": "ميزات مميزة (اختياري)",
            "healthConsiderations": "اعتبارات صحية (اختياري)",
            "dietaryNeeds": "احتياجات غذائية (اختياري)",
            "behaviorAndTemperament": "السلوك والمزاج (اختياري)",
            "activityLevel": "مستوى النشاط (منخفض/متوسط/مرتفع)",
            "createdAt": "تاريخ الإنشاء",
            "updatedAt": "تاريخ آخر تحديث",
            "__v": 0
        }
    ]
    ```
-   **الاستجابة عند وجود خطأ (Error Response - Status 401 Unauthorized / 500 Server Error):**
    ```json
    {
        "message": "Unauthorized jwt"
    }
    ```

#### أمثلة الكود:

**React/Next.js (Frontend - Fetch API):**

```javascript
async function getUserAnimals() {
  try {
    const response = await fetch('YOUR_API_BASE_URL/api/animals', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // مهم لإرسال الكوكيز تلقائيًا
    });

    const data = await response.json();

    if (response.ok) {
      console.log('User animals:', data);
      return data;
    } else {
      console.error('Failed to fetch user animals:', data.message);
      throw new Error(data.message || 'Failed to fetch user animals');
    }
  } catch (error) {
    console.error('Error fetching user animals:', error);
    throw error;
  }
}
```

**React/Next.js (Frontend - Axios):**

```javascript
import axios from 'axios';

async function getUserAnimalsAxios() {
  try {
    const response = await axios.get('YOUR_API_BASE_URL/api/animals', {
      withCredentials: true, // مهم لإرسال الكوكيز تلقائيًا
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('User animals:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching user animals:', error.response ? response.response.data.message : error.message);
    throw error;
  }
}
```

**Flutter (Mobile):**

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;

Future<List<Map<String, dynamic>>> getUserAnimalsFlutter(String accessToken) async {
  final url = Uri.parse('YOUR_API_BASE_URL/api/animals');
  try {
    final response = await http.get(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $accessToken', // إرسال التوكن في رأس Authorization
      },
    );

    if (response.statusCode == 200) {
      final List<dynamic> data = json.decode(response.body);
      print('User animals: $data');
      return data.cast<Map<String, dynamic>>();
    } else {
      final errorData = json.decode(response.body);
      print('Failed to fetch user animals: ${response.statusCode} - ${errorData['message']}');
      throw Exception('Failed to fetch user animals');
    }
  } catch (e) {
    print('Error during fetching user animals: $e');
    throw Exception('Failed to connect to the server');
  }
}
```

### 5. تعديل بيانات حيوان (Update Animal Data)

تتيح هذه الوظيفة للمستخدم تعديل بيانات حيوان معين يمتلكه. يمكن تحديث حقل واحد أو أكثر، أو تحديث الصورة، أو كليهما.

-   **المسار (Endpoint):** `PATCH /api/animals/:id`
-   **الترويسات المطلوبة (Required Headers):**
    *   `Authorization`: `Bearer <ACCESS_TOKEN>` (لمستخدمي الموبايل)
    *   **الكوكيز (Cookies):** `accessToken=<ACCESS_TOKEN>` (لمستخدمي الويب)
    *   `Content-Type`: `application/json` (إذا كنت ترسل بيانات نصية فقط) أو `multipart/form-data` (إذا كنت ترسل صورة و/أو بيانات نصية).
-   **البيانات المطلوبة (Request Body):**
    يمكنك إرسال أي من الحقول التالية (أو مزيج منها). الحقول غير المرسلة ستبقى كما هي.
    ```json
    {
        "name": "اسم الحيوان الجديد",
        "type": "نوع الحيوان الجديد",
        "age": "العمر الجديد",
        "photo": "ملف الصورة (عند استخدام multipart/form-data)",
        "gender": "الجنس الجديد (male/female/unknown)",
        // ... أي حقول أخرى من نموذج الحيوان
    }
    ```
-   **الاستجابة الناجحة (Success Response - Status 200 OK):**
    ```json
    {
        "message": "Animal updated successfully",
        "data": {
            "_id": "معرف الحيوان",
            "user": "معرف المستخدم",
            "photo": "رابط الصورة المحدثة",
            "name": "اسم الحيوان المحدث",
            // ... باقي بيانات الحيوان المحدثة
        }
    }
    ```
-   **الاستجابة عند وجود خطأ (Error Response - Status 400 Bad Request / 401 Unauthorized / 403 Forbidden / 404 Not Found / 500 Server Error):**
    ```json
    {
        "message": "Animal not found" // أو "Unauthorized" أو "Forbidden" أو "Server error"
    }
    ```

#### أمثلة الكود:

**React/Next.js (Frontend - Fetch API - تحديث بيانات نصية فقط):**

```javascript
async function updateAnimalData(animalId, updatedFields) {
  try {
    const response = await fetch(`YOUR_API_BASE_URL/api/animals/${animalId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // مهم لإرسال الكوكيز تلقائيًا
      body: JSON.stringify(updatedFields),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Animal updated successfully:', data);
      return data;
    } else {
      console.error('Failed to update animal:', data.message);
      throw new Error(data.message || 'Failed to update animal');
    }
  } catch (error) {
    console.error('Error updating animal:', error);
    throw error;
  }
}

// مثال للاستخدام:
// updateAnimalData('someAnimalId', { name: 'اسم جديد', age: 4 });
```

**React/Next.js (Frontend - Axios - تحديث بيانات نصية فقط):**

```javascript
import axios from 'axios';

async function updateAnimalDataAxios(animalId, updatedFields) {
  try {
    const response = await axios.patch(`YOUR_API_BASE_URL/api/animals/${animalId}`, updatedFields, {
      withCredentials: true, // مهم لإرسال الكوكيز تلقائيًا
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Animal updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating animal:', error.response ? error.response.data.message : error.message);
    throw error;
  }
}

// مثال للاستخدام:
// updateAnimalDataAxios('someAnimalId', { name: 'اسم جديد', age: 4 });
```

**React/Next.js (Frontend - Fetch API - تحديث صورة و/أو بيانات نصية):**

```javascript
async function updateAnimalWithPhoto(animalId, formData) {
  // formData يجب أن يكون كائن FormData يحتوي على الصورة والحقول الأخرى
  // مثال: 
  // const formData = new FormData();
  // formData.append('photo', fileInput.files[0]);
  // formData.append('name', 'اسم جديد');

  try {
    const response = await fetch(`YOUR_API_BASE_URL/api/animals/${animalId}`, {
      method: 'PATCH',
      // لا تحدد Content-Type هنا، المتصفح سيقوم بتعيينها تلقائيًا لـ FormData
      credentials: 'include', // مهم لإرسال الكوكيز تلقائيًا
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Animal updated successfully:', data);
      return data;
    } else {
      console.error('Failed to update animal:', data.message);
      throw new Error(data.message || 'Failed to update animal');
    }
  } catch (error) {
    console.error('Error updating animal:', error);
    throw error;
  }
}
```

**React/Next.js (Frontend - Axios - تحديث صورة و/أو بيانات نصية):**

```javascript
import axios from 'axios';

async function updateAnimalWithPhotoAxios(animalId, formData) {
  // formData يجب أن يكون كائن FormData يحتوي على الصورة والحقول الأخرى
  // مثال: 
  // const formData = new FormData();
  // formData.append('photo', fileInput.files[0]);
  // formData.append('name', 'اسم جديد');

  try {
    const response = await axios.patch(`YOUR_API_BASE_URL/api/animals/${animalId}`, formData, {
      withCredentials: true, // مهم لإرسال الكوكيز تلقائيًا
      headers: {
        'Content-Type': 'multipart/form-data', // يمكن لـ Axios التعامل معها تلقائيًا، ولكن تحديدها يوضح الغرض
      },
    });

    console.log('Animal updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating animal:', error.response ? error.response.data.message : error.message);
    throw error;
  }
}
```

**Flutter (Mobile - تحديث بيانات نصية فقط):**

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;

Future<Map<String, dynamic>> updateAnimalDataFlutter(String animalId, String accessToken, Map<String, dynamic> updatedFields) async {
  final url = Uri.parse('YOUR_API_BASE_URL/api/animals/$animalId');
  try {
    final response = await http.patch(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $accessToken', // إرسال التوكن في رأس Authorization
      },
      body: json.encode(updatedFields),
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      print('Animal updated successfully: $data');
      return data;
    } else {
      final errorData = json.decode(response.body);
      print('Failed to update animal: ${response.statusCode} - ${errorData['message']}');
      throw Exception('Failed to update animal');
    }
  } catch (e) {
    print('Error during updating animal: $e');
    throw Exception('Failed to connect to the server');
  }
}

// مثال للاستخدام:
// updateAnimalDataFlutter('someAnimalId', 'yourAccessToken', { 'name': 'اسم جديد', 'age': 4 });
```

**Flutter (Mobile - تحديث صورة و/أو بيانات نصية):**

```dart
import 'dart:io';
import 'package:http/http.dart' as http;

Future<Map<String, dynamic>> updateAnimalWithPhotoFlutter(String animalId, String accessToken, {
  File? photoFile,
  Map<String, String>? textFields,
}) async {
  final url = Uri.parse('YOUR_API_BASE_URL/api/animals/$animalId');
  final request = http.MultipartRequest('PATCH', url);

  request.headers['Authorization'] = 'Bearer $accessToken'; // إرسال التوكن في رأس Authorization

  if (photoFile != null) {
    request.files.add(await http.MultipartFile.fromPath(
      'photo', // يجب أن يتطابق هذا مع اسم الحقل في الـ middleware (upload.single('photo'))
      photoFile.path,
      filename: 'animal_photo.jpg',
    ));
  }

  if (textFields != null) {
    request.fields.addAll(textFields);
  }

  try {
    final streamedResponse = await request.send();
    final response = await http.Response.fromStream(streamedResponse);

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      print('Animal updated successfully: $data');
      return data;
    } else {
      final errorData = json.decode(response.body);
      print('Failed to update animal: ${response.statusCode} - ${errorData['message']}');
      throw Exception('Failed to update animal');
    }
  } catch (e) {
    print('Error during updating animal with photo: $e');
    throw Exception('Failed to connect to the server');
  }
}

// مثال للاستخدام:
// updateAnimalWithPhotoFlutter(
//   'someAnimalId',
//   'yourAccessToken',
//   photoFile: File('path/to/your/image.jpg'),
//   textFields: { 'name': 'اسم جديد', 'age': '4' },
// );
```
---
        

# واجهات برمجة التطبيقات للمنتجات والفئات (Product and Category APIs)

توفر واجهات برمجة التطبيقات هذه طرقًا لجلب وإدارة المنتجات والفئات في النظام.

### 1. جلب جميع الفئات (Get All Categories)

تتيح هذه الوظيفة جلب قائمة بجميع الفئات المتاحة.

-   **المسار (Endpoint):** `GET /api/categories`
-   **الاستجابة الناجحة (Success Response - Status 200 OK):**
    ```json
    {
        "categories": [
            {
                "_id": "65e9d5a8a7b8c9d0e1f2a3b4",
                "name": "Dog Food",
                "description": "High-quality food for dogs",
                "createdAt": "2024-03-07T10:00:00.000Z",
                "updatedAt": "2024-03-07T10:00:00.000Z"
            },
            {
                "_id": "65e9d5a8a7b8c9d0e1f2a3b5",
                "name": "Cat Toys",
                "description": "Fun toys for cats",
                "createdAt": "2024-03-07T10:05:00.000Z",
                "updatedAt": "2024-03-07T10:05:00.000Z"
            }
        ]
    }
    ```
-   **الاستجابة عند وجود خطأ (Error Response - Status 500 Server Error):**
    ```json
    {
        "message": "Server error"
    }
    ```

#### أمثلة الكود:

**Flutter (Mobile):**

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;

Future<List<dynamic>> getCategories() async {
  final url = Uri.parse('YOUR_API_BASE_URL/api/categories');
  try {
    final response = await http.get(url);

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      print('Categories fetched successfully: ${data['categories']}');
      return data['categories'];
    } else {
      print('Failed to fetch categories: ${response.statusCode} - ${response.body}');
      throw Exception('Failed to load categories');
    }
  } catch (e) {
    print('Error fetching categories: $e');
    throw Exception('Failed to connect to the server');
  }
}
```

**React (Frontend - Fetch API):**

```javascript
async function getCategories() {
  try {
    const response = await fetch('YOUR_API_BASE_URL/api/categories');
    const data = await response.json();

    if (response.ok) {
      console.log('Categories fetched successfully:', data.categories);
      return data.categories;
    } else {
      console.error('Failed to fetch categories:', data.message);
      throw new Error(data.message || 'Failed to fetch categories');
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}
```

**React (Frontend - Axios):**

```javascript
import axios from 'axios';

async function getCategories() {
  try {
    const response = await axios.get('YOUR_API_BASE_URL/api/categories');
    console.log('Categories fetched successfully:', response.data.categories);
    return response.data.categories;
  } catch (error) {
    console.error('Error fetching categories:', error.response ? error.response.data.message : error.message);
    throw error.response ? error.response.data.message : error.message;
  }
}
```

### 2. جلب جميع المنتجات (Get All Products)

تتيح هذه الوظيفة جلب قائمة بجميع المنتجات المتاحة.

-   **المسار (Endpoint):** `GET /api/products`
-   **الاستجابة الناجحة (Success Response - Status 200 OK):**
-    ** ملحوظه مهمه / لازم تضيف رابط ده  https://pawsh-pets-back-end-api.vercel.app   قبل مسار الصور لعرضها    مثال


```javascript
const img = `https://pawsh-pets-back-end-api.vercel.app${products.image}`

```


```json
    {
        "products": [
            {
                "_id": "65e9d5a8a7b8c9d0e1f2a3b6",
                "title": "Premium Dog Food",
                "description": "Nutritious and delicious dog food",
                "image": "/images/dog_food.png",
                "weight": "10kg",
                "price": 50.00,
                "rating": 4.5,
                "isFavorite": false,
                "category": {
                    "_id": "65e9d5a8a7b8c9d0e1f2a3b4",
                    "name": "Dog Food"
                },
                "createdAt": "2024-03-07T10:10:00.000Z",
                "updatedAt": "2024-03-07T10:10:00.000Z"
            },
            {
                "_id": "65e9d5a8a7b8c9d0e1f2a3b7",
                "title": "Interactive Cat Toy",
                "description": "Keeps your cat entertained for hours",
                "image": "/images/cat_toy.png",
                "weight": "0.2kg",
                "price": 15.00,
                "rating": 4.0,
                "isFavorite": true,
                "category": {
                    "_id": "65e9d5a8a7b8c9d0e1f2a3b5",
                    "name": "Cat Toys"
                },
                "createdAt": "2024-03-07T10:15:00.000Z",
                "updatedAt": "2024-03-07T10:15:00.000Z"
            }
        ]
    }
    ```
-   **الاستجابة عند وجود خطأ (Error Response - Status 500 Server Error):**
    ```json
    {
        "message": "Server error"
    }
 ```

#### أمثلة الكود:

**Flutter (Mobile):**

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;

Future<List<dynamic>> getProducts() async {
  final url = Uri.parse('YOUR_API_BASE_URL/api/products');
  try {
    final response = await http.get(url);

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      print('Products fetched successfully: ${data['products']}');
      return data['products'];
    } else {
      print('Failed to fetch products: ${response.statusCode} - ${response.body}');
      throw Exception('Failed to load products');
    }
  }
  catch (e) {
    print('Error fetching products: $e');
    throw Exception('Failed to connect to the server');
  }
}
```

**React (Frontend - Fetch API):**

```javascript
async function getProducts() {
  try {
    const response = await fetch('YOUR_API_BASE_URL/api/products');
    const data = await response.json();

    if (response.ok) {
      console.log('Products fetched successfully:', data.products);
      return data.products;
    } else {
      console.error('Failed to fetch products:', data.message);
      throw new Error(data.message || 'Failed to fetch products');
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}
```

**React (Frontend - Axios):**

```javascript
import axios from 'axios';

async function getProducts() {
  try {
    const response = await axios.get('YOUR_API_BASE_URL/api/products');
    console.log('Products fetched successfully:', response.data.products);
    return response.data.products;
  } catch (error) {
    console.error('Error fetching products:', error.response ? error.response.data.message : error.message);
    throw error.response ? error.response.data.message : error.message;
  }
}
```

### 3. جلب منتج بواسطة المعرف (Get Product by ID)

تتيح هذه الوظيفة جلب تفاصيل منتج معين باستخدام معرف المنتج الخاص به.

-   **المسار (Endpoint):** `GET /api/products/:id`
-   **الاستجابة الناجحة (Success Response - Status 200 OK):**
    ```json
    {
        "product": {
            "_id": "65e9d5a8a7b8c9d0e1f2a3b6",
            "title": "Premium Dog Food",
            "description": "Nutritious and delicious dog food",
            "image": "/images/dog_food.png",
            "weight": "10kg",
            "price": 50.00,
            "rating": 4.5,
            "isFavorite": false,
            "category": {
                "_id": "65e9d5a8a7b8c9d0e1f2a3b4",
                "name": "Dog Food"
            },
            "createdAt": "2024-03-07T10:10:00.000Z",
            "updatedAt": "2024-03-07T10:10:00.000Z"
        }
    }
    ```
-   **الاستجابة عند وجود خطأ (Error Response - Status 404 Not Found / 500 Server Error):**
    ```json
    {
        "message": "Product not found" // أو "Server error"
    }
    ```

#### أمثلة الكود:

**Flutter (Mobile):**

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;

Future<Map<String, dynamic>> getProductById(String productId) async {
  final url = Uri.parse('YOUR_API_BASE_URL/api/products/$productId');
  try {
    final response = await http.get(url);

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      print('Product fetched successfully: ${data['product']}');
      return data['product'];
    } else {
      print('Failed to fetch product: ${response.statusCode} - ${response.body}');
      throw Exception('Failed to load product');
    }
  } catch (e) {
    print('Error fetching product: $e');
    throw Exception('Failed to connect to the server');
  }
}
```

**React (Frontend - Fetch API):**

```javascript
async function getProductById(productId) {
  try {
    const response = await fetch(`YOUR_API_BASE_URL/api/products/${productId}`);
    const data = await response.json();

    if (response.ok) {
      console.log('Product fetched successfully:', data.product);
      return data.product;
    } else {
      console.error('Failed to fetch product:', data.message);
      throw new Error(data.message || 'Failed to fetch product');
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}
```

**React (Frontend - Axios):**

```javascript
import axios from 'axios';

async function getProductById(productId) {
  try {
    const response = await axios.get(`YOUR_API_BASE_URL/api/products/${productId}`);
    console.log('Product fetched successfully:', response.data.product);
    return response.data.product;
  } catch (error) {
    console.error('Error fetching product:', error.response ? error.response.data.message : error.message);
    throw error.response ? error.response.data.message : error.message;
  }
}
```

### 4. جلب المنتجات بواسطة معرف الفئة (Get Products by Category ID)

تتيح هذه الوظيفة جلب قائمة بالمنتجات التي تنتمي إلى فئة معينة باستخدام معرف الفئة.

-   **المسار (Endpoint):** `GET /api/products/category/:categoryId`
-   **الاستجابة الناجحة (Success Response - Status 200 OK):**
    ```json
    {
        "products": [
            {
                "_id": "65e9d5a8a7b8c9d0e1f2a3b6",
                "title": "Premium Dog Food",
                "description": "Nutritious and delicious dog food",
                "image": "/images/dog_food.png",
                "weight": "10kg",
                "price": 50.00,
                "rating": 4.5,
                "isFavorite": false,
                "category": {
                    "_id": "65e9d5a8a7b8c9d0e1f2a3b4",
                    "name": "Dog Food"
                },
                "createdAt": "2024-03-07T10:10:00.000Z",
                "updatedAt": "2024-03-07T10:10:00.000Z"
            }
        ]
    }
    ```
-   **الاستجابة عند وجود خطأ (Error Response - Status 500 Server Error):**
    ```json
    {
        "message": "Server error"
    }
    ```

#### أمثلة الكود:

**Flutter (Mobile):**

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;

Future<List<dynamic>> getProductsByCategory(String categoryId) async {
  final url = Uri.parse('YOUR_API_BASE_URL/api/products/category/$categoryId');
  try {
    final response = await http.get(url);

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      print('Products by category fetched successfully: ${data['products']}');
      return data['products'];
    } else {
      print('Failed to fetch products by category: ${response.statusCode} - ${response.body}');
      throw Exception('Failed to load products by category');
    }
  } catch (e) {
    print('Error fetching products by category: $e');
    throw Exception('Failed to connect to the server');
  }
}
```

**React (Frontend - Fetch API):**

```javascript
async function getProductsByCategory(categoryId) {
  try {
    const response = await fetch(`YOUR_API_BASE_URL/api/products/category/${categoryId}`);
    const data = await response.json();

    if (response.ok) {
      console.log('Products by category fetched successfully:', data.products);
      return data.products;
    } else {
      console.error('Failed to fetch products by category:', data.message);
      throw new Error(data.message || 'Failed to fetch products by category');
    }
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
}
```

**React (Frontend - Axios):**

```javascript
import axios from 'axios';

async function getProductsByCategory(categoryId) {
  try {
    const response = await axios.get(`YOUR_API_BASE_URL/api/products/category/${categoryId}`);
    console.log('Products by category fetched successfully:', response.data.products);
    return response.data.products;
  } catch (error) {
    console.error('Error fetching products by category:', error.response ? error.response.data.message : error.message);
    throw error.response ? error.response.data.message : error.message;
  }
}
```

---
# واجهات برمجة التطبيقات للمفضلة (Favorites API)

تتيح واجهات برمجة التطبيقات هذه للمستخدمين إدارة قائمة المنتجات المفضلة لديهم.

### 1. إضافة منتج إلى المفضلة (Add Product to Favorites)

تتيح هذه الوظيفة للمستخدم المصادق عليه إضافة منتج إلى قائمة مفضلاته.

-   **المسار (Endpoint):** `POST /api/ADD_favorites`
-   **يتطلب المصادقة:** نعم (Auth Token في Header)
-   **نوع المحتوى (Content-Type):** `application/json`
-   **الجسم (Request Body):**
    ```json
    {
        "productId": "<معرف_المنتج>"
    }
    ```
-   **الاستجابة الناجحة (Success Response - Status 201 Created):**
    ```json
    {
        "message": "Product added to favorites",
        "favorite": {
            "_id": "65e9d5a8a7b8c9d0e1f2a3b8",
            "user": "65e9d5a8a7b8c9d0e1f2a3b9",
            "product": "65e9d5a8a7b8c9d0e1f2a3b6",
            "createdAt": "2024-03-07T10:20:00.000Z",
            "__v": 0
        }
    }
    ```
-   **الاستجابة عند وجود خطأ (Error Responses):**
    -   `400 Bad Request`: `{"message": "Product ID is required"}`
    -   `401 Unauthorized`: `{"message": "Unauthorized"}`
    -   `409 Conflict`: `{"message": "Product already in favorites"}`
    -   `500 Server Error`: `{"message": "Server error"}`

#### أمثلة الكود:

**Flutter (Mobile):**

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;

Future<Map<String, dynamic>> addFavorite(String productId, String token) async {
  final url = Uri.parse('YOUR_API_BASE_URL/api/ADD_favorites');
  try {
    final response = await http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: json.encode({'productId': productId}),
    );

    if (response.statusCode == 201) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to add favorite: ${response.statusCode} - ${response.body}');
    }
  } catch (e) {
    throw Exception('Error adding favorite: $e');
  }
}
```

**React (Frontend - Fetch API):**

```javascript
async function addFavorite(productId, token) {
  try {
    const response = await fetch('YOUR_API_BASE_URL/api/ADD_favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ productId }),
    });
    const data = await response.json();

    if (response.ok) {
      console.log('Product added to favorites:', data);
      return data;
    } else {
      console.error('Failed to add favorite:', data.message);
      throw new Error(data.message || 'Failed to add favorite');
    }
  } catch (error) {
    console.error('Error adding favorite:', error);
    throw error;
  }
}
```

**React (Frontend - Axios):**

```javascript
import axios from 'axios';

async function addFavorite(productId, token) {
  try {
    const response = await axios.post('YOUR_API_BASE_URL/api/ADD_favorites', {
      productId
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    console.log('Product added to favorites:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error adding favorite:', error.response ? error.response.data.message : error.message);
    throw error.response ? error.response.data.message : error.message;
  }
}
```

### 2. جلب جميع المنتجات المفضلة (Get All Favorites)

تتيح هذه الوظيفة للمستخدم المصادق عليه جلب قائمة بجميع المنتجات التي أضافها إلى مفضلاته.

-   **المسار (Endpoint):** `GET /api/favorites`
-   **يتطلب المصادقة:** نعم (Auth Token في Header)
-   **الاستجابة الناجحة (Success Response - Status 200 OK):**
    ```json
    {
        "favorites": [
            {
                "_id": "65e9d5a8a7b8c9d0e1f2a3b8",
                "user": "65e9d5a8a7b8c9d0e1f2a3b9",
                "product": {
                    "_id": "65e9d5a8a7b8c9d0e1f2a3b6",
                    "title": "Premium Dog Food",
                    "image": "/images/dog_food.png",
                    "price": 50.00
                },
                "createdAt": "2024-03-07T10:20:00.000Z"
            }
        ]
    }
    ```
-   **الاستجابة عند وجود خطأ (Error Responses):**
    -   `401 Unauthorized`: `{"message": "Unauthorized"}`
    -   `500 Server Error`: `{"message": "Server error"}`

#### أمثلة الكود:

**Flutter (Mobile):**

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;

Future<List<dynamic>> getFavorites(String token) async {
  final url = Uri.parse('YOUR_API_BASE_URL/api/favorites');
  try {
    final response = await http.get(
      url,
      headers: {
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      return json.decode(response.body)['favorites'];
    } else {
      throw Exception('Failed to fetch favorites: ${response.statusCode} - ${response.body}');
    }
  } catch (e) {
    throw Exception('Error fetching favorites: $e');
  }
}
```

**React (Frontend - Fetch API):**

```javascript
async function getFavorites(token) {
  try {
    const response = await fetch('YOUR_API_BASE_URL/api/favorites', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();

    if (response.ok) {
      console.log('Favorites fetched successfully:', data.favorites);
      return data.favorites;
    } else {
      console.error('Failed to fetch favorites:', data.message);
      throw new Error(data.message || 'Failed to fetch favorites');
    }
  } catch (error) {
    console.error('Error fetching favorites:', error);
    throw error;
  }
}
```

**React (Frontend - Axios):**

```javascript
import axios from 'axios';

async function getFavorites(token) {
  try {
    const response = await axios.get('YOUR_API_BASE_URL/api/favorites', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    console.log('Favorites fetched successfully:', response.data.favorites);
    return response.data.favorites;
  } catch (error) {
    console.error('Error fetching favorites:', error.response ? error.response.data.message : error.message);
    throw error.response ? error.response.data.message : error.message;
  }
}
```

### 3. إزالة منتج من المفضلة (Remove Product from Favorites)

تتيح هذه الوظيفة للمستخدم المصادق عليه إزالة منتج معين من قائمة مفضلاته.

-   **المسار (Endpoint):** `DELETE /api/favorites/:productId`
-   **يتطلب المصادقة:** نعم (Auth Token في Header)
-   **الاستجابة الناجحة (Success Response - Status 200 OK):**
    ```json
    {
        "message": "Product removed from favorites"
    }
    ```
-   **الاستجابة عند وجود خطأ (Error Responses):**
    -   `401 Unauthorized`: `{"message": "Unauthorized"}`
    -   `404 Not Found`: `{"message": "Product not found in favorites"}`
    -   `500 Server Error`: `{"message": "Server error"}`

#### أمثلة الكود:

**Flutter (Mobile):**

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;

Future<Map<String, dynamic>> removeFavorite(String productId, String token) async {
  final url = Uri.parse('YOUR_API_BASE_URL/api/favorites/$productId');
  try {
    final response = await http.delete(
      url,
      headers: {
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to remove favorite: ${response.statusCode} - ${response.body}');
    }
  } catch (e) {
    throw Exception('Error removing favorite: $e');
  }
}
```

**React (Frontend - Fetch API):n**

```javascript
async function removeFavorite(productId, token) {
  try {
    const response = await fetch(`YOUR_API_BASE_URL/api/favorites/${productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();

    if (response.ok) {
      console.log('Product removed from favorites:', data.message);
      return data;
    } else {
      console.error('Failed to remove favorite:', data.message);
      throw new Error(data.message || 'Failed to remove favorite');
    }
  } catch (error) {
    console.error('Error removing favorite:', error);
    throw error;
  }
}
```

**React (Frontend - Axios):**

```javascript
import axios from 'axios';

async function removeFavorite(productId, token) {
  try {
    const response = await axios.delete(`YOUR_API_BASE_URL/api/favorites/${productId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    console.log('Product removed from favorites:', response.data.message);
    return response.data;
  } catch (error) {
    console.error('Error removing favorite:', error.response ? error.response.data.message : error.message);
    throw error.response ? error.response.data.message : error.message;
  }
}
```
        