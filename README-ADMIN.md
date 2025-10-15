# Pawsh API Admin Documentation
## 1. نقطة نهاية تسجيل الدخول (Login Endpoint)

```
https://pawsh-pets-back-end-api.vercel.app
```
*   **المسار (Path) وطريقة HTTP:** `POST /api/auth/logiadmin`
*   **الوصف (Description):** تسجيل دخول المسؤول.
*   **الرؤوس المطلوبة (Required Headers):** لا يوجد رؤوس خاصة مطلوبة بخلاف `Content-Type: application/json`.
*   **الجسم المطلوب (Request Body):**
    ```json
    {
        "email": "admin@example.com",
        "password": "adminpassword",
        "client": "web" // أو "mobile"
    }
    ```
*   **الاستجابات المحتملة (Possible Responses):**
    *   `200 OK`: تسجيل دخول ناجح، مع التوكنات في الكوكيز (لـ `client: "web"`) أو في جسم الاستجابة (لـ `client: "mobile"`).
    *   `400 Bad Request`: إذا كانت الحقول المطلوبة (email, password) مفقودة.
    *   `401 Unauthorized`: إذا كانت بيانات الاعتماد غير صالحة أو إذا لم يكن المستخدم مسؤولاً.
    *   `500 Internal Server Error`: خطأ في الخادم.

*   **أمثلة كود لـ Next.js/React (باستخدام `axios` و `fetch`):**

    **باستخدام Axios:**
    ```javascript
    import axios from 'axios';

    const loginAdminWeb = async (email, password) => {
        try {
            const response = await axios.post('/api/auth/logiadmin', {
                email,
                password,
                client: 'web'
            }, {
                withCredentials: true // مهم لإرسال واستقبال الكوكيز
            });
            console.log('Admin login successful (web):', response.data);
            return response.data;
        } catch (error) {
            console.error('Admin login failed (web):', error.response ? error.response.data : error.message);
            throw error;
        }
    };

    ```

    **باستخدام Fetch:**
    ```javascript
    const loginAdminWeb = async (email, password) => {
        try {
            const response = await fetch('/api/auth/logiadmin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password,
                    client: 'web'
                }),
                credentials: 'include' // مهم لإرسال واستقبال الكوكيز
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Admin login failed');
            }
            console.log('Admin login successful (web):', data);
            return data;
        } catch (error) {
            console.error('Admin login failed (web):', error.message);
            throw error;
        }
    };


    ```

*   **أمثلة كود لـ Flutter:**

    ```dart
    import 'dart:convert';
    import 'package:http/http.dart' as http;

    Future<Map<String, dynamic>> loginAdmin(String email, String password) async {
      final url = Uri.parse('YOUR_API_BASE_URL/api/auth/logiadmin'); // استبدل YOUR_API_BASE_URL بعنوان الـ API الخاص بك
      try {
        final response = await http.post(
          url,
          headers: <String, String>{
            'Content-Type': 'application/json; charset=UTF-8',
          },
          body: jsonEncode(<String, String>{
            'email': email,
            'password': password,
            'client': 'mobile', // أو 'web' إذا كنت تستخدم Flutter للويب وتتعامل مع الكوكيز
          }),
        );

        final responseData = jsonDecode(response.body);

        if (response.statusCode == 200) {
          print('Admin login successful: ${responseData['message']}');
          // إذا كان client: 'mobile'، ستجد التوكنات هنا
          // final String accessToken = responseData['tokens']['accessToken'];
          // final String refreshToken = responseData['tokens']['refreshToken'];
          // يمكنك تخزين التوكنات بشكل آمن (مثل باستخدام flutter_secure_storage)
          return responseData;
        } else {
          print('Admin login failed: ${responseData['message']}');
          throw Exception(responseData['message'] ?? 'Failed to login as admin');
        }
      } catch (e) {
        print('Error during admin login: $e');
        throw Exception('Failed to connect to the server for admin login');
      }
    }

    // مثال على كيفية الاستخدام:
    // void main() async {
    //   try {
    //     final adminData = await loginAdmin('admin@example.com', 'adminpassword');
    //     print('Logged in admin data: $adminData');
    //   } catch (e) {
    //     print('Admin login error: $e');
    //   }
    // }
    ```

---


### نقطة نهاية التحقق من توكن الوصول للمسؤول (Verify Admin Access Token)

*   **المسار (Path) وطريقة HTTP:** `POST /api/auth/verifyadmin-token`

*   **أمثلة كود لـ Next.js/React (باستخدام `axios` و `fetch`):**

    **باستخدام Axios:**
    ```javascript
    import axios from 'axios';

    const verifyAdminAccessToken = async (accessToken) => {
        try {
            const response = await axios.post('/api/auth/verifyadmin-token', {},
                {
                     withCredentials: true // مهم لإرسال واستقبال الكوكيز
                }
            );
            console.log('Admin access token verification:', response.data);
            return response.data;
        } catch (error) {
            console.error('Admin access token verification failed:', error.response ? error.response.data : error.message);
            throw error;
        }
    };
    ```

    **باستخدام Fetch:**
    ```javascript
    const verifyAdminAccessToken = async (accessToken) => {
        try {
            const response = await fetch('/api/auth/verifyadmin-token', {
                method: 'POST',
                   headers: {
                             'Content-Type': 'application/json',
                           },
                   credentials: 'include', // مهم لإرسال واستقبال الكوكيز
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Admin access token verification failed');
            }
            console.log('Admin access token verification:', data);
            return data;
        } catch (error) {
            console.error('Admin access token verification failed:', error.message);
            throw error;
        }
    };
    ```

*   **أمثلة كود لـ Flutter:**

    ```dart
    import 'dart:convert';
    import 'package:http/http.dart' as http;

    Future<Map<String, dynamic>> verifyAdminAccessToken(String accessToken) async {
      final url = Uri.parse('YOUR_API_BASE_URL/api/auth/verifyadmin-token');
      try {
        final response = await http.post(
          url,
          headers: <String, String>{
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': 'Bearer $accessToken',
          },
        );

        final responseData = jsonDecode(response.body);

        if (response.statusCode == 200) {
          print('Admin access token verification: ${responseData['message']}');
          return responseData;
        } else {
          print('Admin access token verification failed: ${responseData['message']}');
          throw Exception(responseData['message'] ?? 'Failed to verify admin access token');
        }
      } catch (e) {
        print('Error during admin access token verification: $e');
        throw Exception('Failed to connect to the server for admin access token verification');
      }
    }
    ```

### نقطة نهاية تحديث توكن الوصول للمسؤول (Refresh Admin Access Token)

*   **المسار (Path) وطريقة HTTP:** `POST /api/auth/refresh-admin-token`
*   **الوصف (Description):** تستخدم لتحديث توكن الوصول الخاص بالمسؤول باستخدام توكن التحديث.
*   **الرؤوس المطلوبة (Required Headers):** لا يوجد رؤوس خاصة مطلوبة بخلاف `Content-Type: application/json`.
*   **الجسم المطلوب (Request Body):**
    *   **لعملاء الويب (`client: "web"`):** يتم إرسال `refreshToken` تلقائيًا عبر الكوكيز.
    *   **لعملاء الموبايل (`client: "mobile"`):**
        ```json
        {
            "refreshToken": "<your_refresh_token>",
            "client": "mobile"
        }
        ```
        أو يمكن إرسال `refreshToken` في رأس `Authorization`:
        `Authorization: Bearer <your_refresh_token>`

*   **الاستجابات المحتملة (Possible Responses):**
    *   `200 OK`: `{"message": "Access token refreshed (web)"}` (لعملاء الويب) أو `{"message": "Access token refreshed (mobile)", "accessToken": "<new_access_token>"}` (لعملاء الموبايل).
    *   `401 Unauthorized`: `{"message": "No refresh token provided"}` أو `{"message": "Refresh token expired"}` أو `{"message": "Invalid refresh token"}`.
    *   `500 Internal Server Error`: خطأ في الخادم.

*   **أمثلة كود لـ Next.js/React (باستخدام `axios` و `fetch`):**

    **باستخدام Axios:**
    ```javascript
    import axios from 'axios';

    const refreshAdminTokenWeb = async () => {
        try {
            const response = await axios.post('/api/auth/refresh-admin-token', {
                client: 'web'
            }, {
                withCredentials: true // مهم لإرسال واستقبال الكوكيز
            });
            console.log('Admin access token refreshed (web):', response.data);
            return response.data;
        } catch (error) {
            console.error('Admin access token refresh failed (web):', error.response ? error.response.data : error.message);
            throw error;
        }
    };

    ```

    **باستخدام Fetch:**
    ```javascript
    const refreshAdminTokenWeb = async () => {
        try {
            const response = await fetch('/api/auth/refresh-admin-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    client: 'web'
                }),
                credentials: 'include' // مهم لإرسال واستقبال الكوكيز
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Admin access token refresh failed');
            }
            console.log('Admin access token refreshed (web):', data);
            return data;
        } catch (error) {
            console.error('Admin access token refresh failed (web):', error.message);
            throw error;
        }
    };

    ```

*   **أمثلة كود لـ Flutter:**

    ```dart
    import 'dart:convert';
    import 'package:http/http.dart' as http;

    Future<Map<String, dynamic>> refreshAdminAccessToken(String refreshToken) async {
      final url = Uri.parse('YOUR_API_BASE_URL/api/auth/refresh-admin-token');
      try {
        final response = await http.post(
          url,
          headers: <String, String>{
            'Content-Type': 'application/json; charset=UTF-8',
            // يمكن إرسال refreshToken في رأس Authorization أيضًا إذا كان الخادم يدعم ذلك
            // 'Authorization': 'Bearer $refreshToken',
          },
          body: jsonEncode(<String, String>{
            'refreshToken': refreshToken,
            'client': 'mobile', // أو 'web' إذا كنت تستخدم Flutter للويب وتتعامل مع الكوكيز
          }),
        );

        final responseData = jsonDecode(response.body);

        if (response.statusCode == 200) {
          print('Admin access token refreshed: ${responseData['message']}');
          // إذا كان client: 'mobile'، ستجد توكن الوصول الجديد هنا
          // final String newAccessToken = responseData['accessToken'];
          // يمكنك تخزين توكن الوصول الجديد بشكل آمن
          return responseData;
        } else {
          print('Admin access token refresh failed: ${responseData['message']}');
          throw Exception(responseData['message'] ?? 'Failed to refresh admin access token');
        }
      } catch (e) {
        print('Error during admin access token refresh: $e');
        throw Exception('Failed to connect to the server for admin access token refresh');
      }
    }
    ```







---



## اللي تحت لسه مش خلصان 


---


## 2. نقاط نهاية الفئات (Category Endpoints)
*(من ملف <mcfile name="categoryRoutes.ts" path="d:\my project\Pawsh\pawsh-API\src\Routers\categoryRoutes.ts"></mcfile> - تتطلب صلاحيات المسؤول (Admin) لـ `POST`, `PUT`, `DELETE`)*

### الحصول على جميع الفئات (Get All Categories)
- **الأسلوب (Method)**: `GET`
- **المسار (Path)**: `/categories`
- **الوصف**: يسترجع قائمة بجميع الفئات المتاحة.
- **الاستجابة (Response)**:
  ```json
  {
    "categories": [
      {
        "_id": "category_id_1",
        "name": "string",
        "description": "string",
        "createdAt": "ISO Date",
        "updatedAt": "ISO Date"
      },
      // ... المزيد من الفئات
    ]
  }
  ```

**Fetch Example**:
```javascript
const fetchCategories = async () => {
  try {
    const response = await fetch('/api/categories');
    const data = await response.json();
    if (response.ok) {
      console.log('Categories:', data.categories);
      // تحديث حالة الفئات في الواجهة الأمامية
    } else {
      console.error('Failed to fetch categories:', data.message);
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};

// مثال للاستخدام:
// fetchCategories();
```

### إنشاء فئة (Create Category) (للمسؤولين فقط)
- **الأسلوب (Method)**: `POST`
- **المسار (Path)**: `/categories`
- **الوصف**: يقوم بإنشاء فئة جديدة. يتطلب أن يكون المستخدم مسؤولاً.
- **الرؤوس (Headers)**: `Authorization: Bearer {token}` (توكن المسؤول)
- **جسم الطلب (Request Body)**:
  ```json
  {
    "name": "string",
    "description": "string" (اختياري)
  }
  ```
- **الاستجابة (Response)**:
  ```json
  {
    "message": "Category created successfully",
    "category": {
      "_id": "new_category_id",
      "name": "string",
      "description": "string",
      "createdAt": "ISO Date",
      "updatedAt": "ISO Date"
    }
  }
  ```
- **حالات الخطأ**: 
  - `400 Bad Request`: إذا كان اسم الفئة مفقودًا.
  - `401 Unauthorized`: إذا لم يتم توفير توكن أو كان غير صالح.
  - `403 Forbidden`: إذا لم يكن المستخدم مسؤولاً.
  - `409 Conflict`: إذا كانت الفئة بهذا الاسم موجودة بالفعل.

**Axios Example**:
```javascript
import axios from 'axios';

const createNewCategory = async (name, description, adminToken) => {
  try {
    const response = await axios.post('/api/categories', 
      { name, description },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    console.log('Category created:', response.data);
    // تحديث قائمة الفئات أو عرض رسالة نجاح
  } catch (error) {
    console.error('Error creating category:', error.response ? error.response.data : error.message);
    // عرض رسالة خطأ للمستخدم
  }
};

// مثال للاستخدام:
// createNewCategory('Pet Food', 'High quality food for all pets', 'YOUR_ADMIN_JWT_TOKEN');
```

### الحصول على فئة بواسطة المعرف (Get Category by ID)
- **الأسلوب (Method)**: `GET`
- **المسار (Path)**: `/categories/:id` (استبدل `:id` بمعرف الفئة)
- **الوصف**: يسترجع تفاصيل فئة محددة بواسطة معرفها.
- **الاستجابة (Response)**:
  ```json
  {
    "category": {
      "_id": "category_id",
      "name": "string",
      "description": "string",
      "createdAt": "ISO Date",
      "updatedAt": "ISO Date"
    }
  }
  ```
- **حالات الخطأ**: 
  - `404 Not Found`: إذا لم يتم العثور على الفئة بالمعرف المحدد.

**Flutter (Dart) Example**:
```dart
import 'package:http/http.dart' as http;
import 'dart:convert';

Future<void> getCategoryById(String categoryId) async {
  final url = Uri.parse('http://localhost:3000/api/categories/$categoryId');
  try {
    final response = await http.get(url);

    if (response.statusCode == 200) {
      final responseData = jsonDecode(response.body);
      print('Category details: ${responseData['category']}');
    } else {
      print('Failed to fetch category: ${response.statusCode} - ${response.body}');
    }
  } catch (error) {
    print('Error fetching category: $error');
  }
}

// مثال للاستخدام:
// getCategoryById('650a1b3f8f1d8c1a2b3c4d5e');
```

### تحديث فئة (Update Category) (للمسؤولين فقط)
- **الأسلوب (Method)**: `PUT`
- **المسار (Path)**: `/categories/:id`
- **الوصف**: يقوم بتحديث فئة موجودة. يتطلب أن يكون المستخدم مسؤولاً.
- **الرؤوس (Headers)**: `Authorization: Bearer {token}` (توكن المسؤول)
- **جسم الطلب (Request Body)**:
  ```json
  {
    "name": "string" (اختياري),
    "description": "string" (اختياري)
  }
  ```
- **الاستجابة (Response)**:
  ```json
  {
    "message": "Category updated successfully",
    "category": {
      "_id": "category_id",
      "name": "string",
      "description": "string",
      "createdAt": "ISO Date",
      "updatedAt": "ISO Date"
    }
  }
  ```
- **حالات الخطأ**: 
  - `401 Unauthorized`: إذا لم يتم توفير توكن أو كان غير صالح.
  - `403 Forbidden`: إذا لم يكن المستخدم مسؤولاً.
  - `404 Not Found`: إذا لم يتم العثور على الفئة بالمعرف المحدد.

### حذف فئة (Delete Category) (للمسؤولين فقط)
- **الأسلوب (Method)**: `DELETE`
- **المسار (Path)**: `/categories/:id`
- **الوصف**: يقوم بحذف فئة موجودة. يتطلب أن يكون المستخدم مسؤولاً.
- **الرؤوس (Headers)**: `Authorization: Bearer {token}` (توكن المسؤول)
- **الاستجابة (Response)**:
  ```json
  {
    "message": "Category deleted successfully"
  }
  ```
- **حالات الخطأ**: 
  - `401 Unauthorized`: إذا لم يتم توفير توكن أو كان غير صالح.
  - `403 Forbidden`: إذا لم يكن المستخدم مسؤولاً.
  - `404 Not Found`: إذا لم يتم العثور على الفئة بالمعرف المحدد.

---

## 3. نقاط نهاية المنتجات (Product Endpoints)
*(من ملف <mcfile name="productRoutes.ts" path="d:\my project\Pawsh\pawsh-API\src\Routers\productRoutes.ts"></mcfile> - تتطلب صلاحيات المسؤول (Admin) لـ `POST`, `PUT`, `DELETE`)*

### إنشاء منتج (Create Product) (للمسؤولين فقط)
- **الأسلوب (Method)**: `POST`
- **المسار (Path)**: `/products`
- **الوصف**: يقوم بإنشاء منتج جديد. يتطلب أن يكون المستخدم مسؤولاً، ويدعم تحميل الصور.
- **الرؤوس (Headers)**: `Authorization: Bearer {token}` (توكن المسؤول), `Content-Type: multipart/form-data`
- **جسم الطلب (Request Body)**: بيانات نموذج (Form Data) تحتوي على:
  - `image`: ملف الصورة (File) - **مطلوب**
  - `title`: `string` - **مطلوب**
  - `description`: `string` (اختياري)
  - `weight`: `number` - **مطلوب**
  - `price`: `number` - **مطلوب**
  - `rating`: `number` (اختياري، الافتراضي 0)
  - `isFavorite`: `boolean` (اختياري، الافتراضي `false`)
  - `category`: `string` (معرف الفئة) - **مطلوب**
- **الاستجابة (Response)**:
  ```json
  {
    "message": "Product created successfully",
    "product": {
      "_id": "new_product_id",
      "title": "string",
      "description": "string",
      "image": "url_to_image",
      "weight": "number",
      "price": "number",
      "rating": "number",
      "isFavorite": "boolean",
      "category": "category_id",
      "createdAt": "ISO Date",
      "updatedAt": "ISO Date"
    }
  }
  ```
- **حالات الخطأ**: 
  - `400 Bad Request`: إذا كانت الصورة أو الحقول المطلوبة مفقودة.
  - `401 Unauthorized`: إذا لم يتم توفير توكن أو كان غير صالح.
  - `403 Forbidden`: إذا لم يكن المستخدم مسؤولاً.

**Flutter (Dart) Example**:
```dart
import 'package:http/http.dart' as http;
import 'package:path/path.dart';
import 'package:async/async.dart';
import 'dart:io';

Future<void> createProduct(String adminToken, File imageFile, Map<String, String> productData) async {
  final url = Uri.parse('http://localhost:3000/api/products');
  var request = http.MultipartRequest('POST', url);

  request.headers['Authorization'] = 'Bearer $adminToken';

  // إضافة ملف الصورة
  var stream = http.ByteStream(DelegatingStream.typed(imageFile.openRead()));
  var length = await imageFile.length();
  var multipartFile = http.MultipartFile('image', stream, length, filename: basename(imageFile.path));
  request.files.add(multipartFile);

  // إضافة حقول المنتج الأخرى
  productData.forEach((key, value) => request.fields[key] = value);

  try {
    final response = await request.send();
    final responseBody = await response.stream.bytesToString();

    if (response.statusCode == 201) {
      print('Product created: $responseBody');
    } else {
      print('Failed to create product: ${response.statusCode} - $responseBody');
    }
  } catch (error) {
    print('Error creating product: $error');
  }
}

// مثال للاستخدام:
// final image = File('path/to/your/image.jpg');
// final productInfo = {
//   'title': 'Dog Food Premium',
//   'description': 'High quality dog food',
//   'weight': '10',
//   'price': '45.99',
//   'category': '650a1b3f8f1d8c1a2b3c4d5e' // معرف الفئة
// };
// createProduct('YOUR_ADMIN_JWT_TOKEN', image, productInfo);
```

### الحصول على جميع المنتجات (Get All Products)
- **الأسلوب (Method)**: `GET`
- **المسار (Path)**: `/products`
- **الوصف**: يسترجع قائمة بجميع المنتجات المتاحة، مع جلب تفاصيل الفئة المرتبطة بكل منتج.
- **الاستجابة (Response)**:
  ```json
  {
    "products": [
      {
        "_id": "product_id_1",
        "title": "string",
        "description": "string",
        "image": "url_to_image",
        "weight": "number",
        "price": "number",
        "rating": "number",
        "isFavorite": "boolean",
        "category": {
          "_id": "category_id",
          "name": "string"
        },
        "createdAt": "ISO Date",
        "updatedAt": "ISO Date"
      },
      // ... المزيد من المنتجات
    ]
  }
  ```

**Fetch Example**:
```javascript
const fetchProducts = async () => {
  try {
    const response = await fetch('/api/products');
    const data = await response.json();
    if (response.ok) {
      console.log('Products:', data.products);
      // تحديث حالة المنتجات في الواجهة الأمامية
    } else {
      console.error('Failed to fetch products:', data.message);
    }
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

// مثال للاستخدام:
// fetchProducts();
```

### الحصول على منتج بواسطة المعرف (Get Product by ID)
- **الأسلوب (Method)**: `GET`
- **المسار (Path)**: `/products/:id`
- **الوصف**: يسترجع تفاصيل منتج محدد بواسطة معرفه، مع جلب تفاصيل الفئة المرتبطة.
- **الاستجابة (Response)**:
  ```json
  {
    "product": {
      "_id": "product_id",
      "title": "string",
      "description": "string",
      "image": "url_to_image",
      "weight": "number",
      "price": "number",
      "rating": "number",
      "isFavorite": "boolean",
      "category": {
        "_id": "category_id",
        "name": "string"
      },
      "createdAt": "ISO Date",
      "updatedAt": "ISO Date"
    }
  }
  ```
- **حالات الخطأ**: 
  - `404 Not Found`: إذا لم يتم العثور على المنتج بالمعرف المحدد.

### تحديث منتج (Update Product) (للمسؤولين فقط)
- **الأسلوب (Method)**: `PUT`
- **المسار (Path)**: `/products/:id`
- **الوصف**: يقوم بتحديث منتج موجود. يتطلب أن يكون المستخدم مسؤولاً. يدعم تحديث الصورة أو أي حقول أخرى.
- **الرؤوس (Headers)**: `Authorization: Bearer {token}`, `Content-Type: multipart/form-data` (إذا كنت تقوم بتحديث الصورة)
- **جسم الطلب (Request Body)**: بيانات نموذج (Form Data) يمكن أن تحتوي على أي من الحقول التالية:
  - `image`: ملف الصورة الجديد (اختياري)
  - `title`: `string` (اختياري)
  - `description`: `string` (اختياري)
  - `weight`: `number` (اختياري)
  - `price`: `number` (اختياري)
  - `rating`: `number` (اختياري)
  - `isFavorite`: `boolean` (اختياري)
  - `category`: `string` (معرف الفئة، اختياري)
- **الاستجابة (Response)**:
  ```json
  {
    "message": "Product updated successfully",
    "product": { /* بيانات المنتج المحدثة */ }
  }
  ```
- **حالات الخطأ**: 
  - `401 Unauthorized`: إذا لم يتم توفير توكن أو كان غير صالح.
  - `403 Forbidden`: إذا لم يكن المستخدم مسؤولاً.
  - `404 Not Found`: إذا لم يتم العثور على المنتج بالمعرف المحدد.

### حذف منتج (Delete Product) (للمسؤولين فقط)
- **الأسلوب (Method)**: `DELETE`
- **المسار (Path)**: `/products/:id`
- **الوصف**: يقوم بحذف منتج موجود. يتطلب أن يكون المستخدم مسؤولاً.
- **الرؤوس (Headers)**: `Authorization: Bearer {token}`
- **الاستجابة (Response)**:
  ```json
  {
    "message": "Product deleted successfully"
  }
  ```
- **حالات الخطأ**: 
  - `401 Unauthorized`: إذا لم يتم توفير توكن أو كان غير صالح.
  - `403 Forbidden`: إذا لم يكن المستخدم مسؤولاً.
  - `404 Not Found`: إذا لم يتم العثور على المنتج بالمعرف المحدد.

---

## 4. نقاط نهاية المفضلة (Favorite Endpoints)
*(من ملف <mcfile name="favoriteRoutes.ts" path="d:\my project\Pawsh\pawsh-API\src\Routers\favoriteRoutes.ts"></mcfile> - تتطلب مصادقة المستخدم)*

### إضافة منتج إلى المفضلة (Add Favorite)
- **الأسلوب (Method)**: `POST`
- **المسار (Path)**: `/favorites`
- **الوصف**: يضيف منتجًا إلى قائمة المفضلة للمستخدم الحالي. يتطلب مصادقة المستخدم.
- **الرؤوس (Headers)**: `Authorization: Bearer {token}` (توكن المستخدم)
- **جسم الطلب (Request Body)**:
  ```json
  {
    "productId": "string" // معرف المنتج المراد إضافته للمفضلة
  }
  ```
- **الاستجابة (Response)**:
  ```json
  {
    "message": "Product added to favorites",
    "favorite": {
      "_id": "favorite_id",
      "user": "user_id",
      "product": "product_id",
      "createdAt": "ISO Date",
      "updatedAt": "ISO Date"
    }
  }
  ```
- **حالات الخطأ**: 
  - `400 Bad Request`: إذا كان `productId` مفقودًا.
  - `401 Unauthorized`: إذا لم يتم توفير توكن أو كان غير صالح.
  - `409 Conflict`: إذا كان المنتج موجودًا بالفعل في قائمة المفضلة للمستخدم.

**Axios Example**:
```javascript
import axios from 'axios';

const addProductToFavorites = async (productId, userToken) => {
  try {
    const response = await axios.post('/api/favorites', 
      { productId },
      { headers: { Authorization: `Bearer ${userToken}` } }
    );
    console.log('Favorite added:', response.data);
    // تحديث الواجهة الأمامية لعرض المنتج كمفضل
  } catch (error) {
    console.error('Error adding favorite:', error.response ? error.response.data : error.message);
  }
};

// مثال للاستخدام:
// addProductToFavorites('650a1b3f8f1d8c1a2b3c4d5e', 'YOUR_USER_JWT_TOKEN');
```

### الحصول على مفضلات المستخدم (Get User Favorites)
- **الأسلوب (Method)**: `GET`
- **المسار (Path)**: `/favorites`
- **الوصف**: يسترجع قائمة بجميع المنتجات المفضلة للمستخدم الحالي. يتطلب مصادقة المستخدم.
- **الرؤوس (Headers)**: `Authorization: Bearer {token}`
- **الاستجابة (Response)**:
  ```json
  {
    "favorites": [
      {
        "_id": "favorite_id_1",
        "user": "user_id",
        "product": {
          "_id": "product_id_1",
          "title": "string",
          "image": "url_to_image",
          "price": "number"
          // ... حقول المنتج الأخرى التي يتم جلبها بواسطة populate
        },
        "createdAt": "ISO Date",
        "updatedAt": "ISO Date"
      },
      // ... المزيد من المنتجات المفضلة
    ]
  }
  ```
- **حالات الخطأ**: 
  - `401 Unauthorized`: إذا لم يتم توفير توكن أو كان غير صالح.

**Flutter (Dart) Example**:
```dart
import 'package:http/http.dart' as http;
import 'dart:convert';

Future<void> getUserFavorites(String userToken) async {
  final url = Uri.parse('http://localhost:3000/api/favorites');
  try {
    final response = await http.get(
      url,
      headers: { 'Authorization': 'Bearer $userToken' },
    );

    if (response.statusCode == 200) {
      final responseData = jsonDecode(response.body);
      print('User favorites: ${responseData['favorites']}');
      // تحديث الواجهة الأمامية لعرض قائمة المفضلة
    } else {
      print('Failed to fetch favorites: ${response.statusCode} - ${response.body}');
    }
  } catch (error) {
    print('Error fetching favorites: $error');
  }
}

// مثال للاستخدام:
// getUserFavorites('YOUR_USER_JWT_TOKEN');
```

### إزالة منتج من المفضلة (Remove Favorite)
- **الأسلوب (Method)**: `DELETE`
- **المسار (Path)**: `/favorites/:productId` (استبدل `:productId` بمعرف المنتج المراد إزالته)
- **الوصف**: يزيل منتجًا من قائمة المفضلة للمستخدم الحالي. يتطلب مصادقة المستخدم.
- **الرؤوس (Headers)**: `Authorization: Bearer {token}`
- **الاستجابة (Response)**:
  ```json
  {
    "message": "Product removed from favorites"
  }
  ```
- **حالات الخطأ**: 
  - `401 Unauthorized`: إذا لم يتم توفير توكن أو كان غير صالح.
  - `404 Not Found`: إذا لم يتم العثور على المنتج في قائمة المفضلة للمستخدم.

---

## 5. نقاط نهاية الحيوانات (Animal Endpoints)
*(من ملف <mcfile name="animalRoutes.ts" path="d:\my project\Pawsh\pawsh-API\src\Routers\animalRoutes.ts"></mcfile> - تتطلب مصادقة المستخدم لإنشاء حيوان)*

### إنشاء حيوان (Create Animal)
- **الأسلوب (Method)**: `POST`
- **المسار (Path)**: `/animals`
- **الوصف**: يقوم بإنشاء سجل حيوان جديد. يتطلب مصادقة المستخدم.
- **الرؤوس (Headers)**: `Authorization: Bearer {token}` (توكن المستخدم)
- **جسم الطلب (Request Body)**:
  ```json
  {
    "user": "string" (معرف المستخدم),
    "photo": "string" (URL أو Base64),
    "type": "string" (مثال: "dog", "cat"),
    "name": "string",
    "breedOrSpecies": "string",
    "age": "number",
    "weight": "number",
    "gender": "male" | "female" | "unknown",
    "identifyingFeatures": "string" (اختياري),
    "healthConsiderations": "string" (اختياري),
    "dietaryNeeds": "string" (اختياري)
  }
  ```
- **الاستجابة (Response)**:
  ```json
  {
    "message": "Animal created successfully",
    "animal": { /* بيانات الحيوان الذي تم إنشاؤه */ }
  }
  ```
- **حالات الخطأ**: 
  - `400 Bad Request`: إذا كانت البيانات المدخلة غير صحيحة أو ناقصة.
  - `401 Unauthorized`: إذا لم يتم توفير توكن أو كان غير صالح.

### الحصول على جميع الحيوانات (Get All Animals)
- **الأسلوب (Method)**: `GET`
- **المسار (Path)**: `/animals`
- **الوصف**: يسترجع قائمة بجميع الحيوانات المسجلة.
- **الاستجابة (Response)**:
  ```json
  {
    "animals": [ /* قائمة بالحيوانات */ ]
  }
  ```

### الحصول على حيوان بواسطة المعرف (Get Animal by ID)
- **الأسلوب (Method)**: `GET`
- **المسار (Path)**: `/animals/:id`
- **الوصف**: يسترجع تفاصيل حيوان محدد بواسطة معرفه.
- **الاستجابة (Response)**:
  ```json
  {
    "animal": { /* بيانات الحيوان */ }
  }
  ```
        Output is too long, please enter 'Continue' to get more.

