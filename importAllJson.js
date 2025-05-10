const fs = require('fs');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');

// MongoDB Atlas URI
const uri = "mongodb+srv://Ngocan12:Ngocan1234@webctt2.ukksayw.mongodb.net/?retryWrites=true&w=majority&appName=WEBCTT2";
const client = new MongoClient(uri);

// Tên thư mục chứa các file JSON
const dataDir = path.join(__dirname, 'database');

// Tên database bạn muốn sử dụng
const dbName = 'WEBCTT2';

async function importAllJSON() {
    try {
        await client.connect();
        const db = client.db(dbName);

        // Lấy danh sách file JSON trong thư mục
        const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.json'));

        for (const file of files) {
            const filePath = path.join(dataDir, file);
            const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            const collectionName = path.basename(file, '.json');

            // Thay thế ObjectId trong dữ liệu
            const updatedContent = content.map(item => replaceOid(item));

            // Insert dữ liệu vào MongoDB
            if (Array.isArray(updatedContent)) {
                const result = await db.collection(collectionName).insertMany(updatedContent);
                console.log(`✅ Đã import ${result.insertedCount} tài liệu vào collection "${collectionName}"`);
            } else {
                const result = await db.collection(collectionName).insertOne(updatedContent);
                console.log(`✅ Đã import 1 tài liệu vào collection "${collectionName}"`);
            }
        }
    } catch (err) {
        console.error('❌ Lỗi:', err);
    } finally {
        await client.close();
    }
}

// Hàm thay thế ObjectId trong các tệp JSON
function replaceOid(obj) {
    if (obj._id && obj._id.$oid) {
        // Chuyển _id từ kiểu $oid sang ObjectId hợp lệ
        obj._id = new ObjectId(obj._id.$oid);
    }

    // Đệ quy cho các đối tượng trong mảng hoặc đối tượng con
    for (let key in obj) {
        if (obj[key] && typeof obj[key] === 'object') {
            replaceOid(obj[key]);
        }
    }
    return obj;
}

importAllJSON();