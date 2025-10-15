

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
        
