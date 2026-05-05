const urls = [
'https://images.unsplash.com/photo-1550547660-d9450f859349',
'https://images.unsplash.com/photo-1568901346375-23c9450c58cd',
'https://images.unsplash.com/photo-1573080496219-bb080dd4f877',
'https://images.unsplash.com/photo-1622483767028-3f66f32aef97',
'https://images.unsplash.com/photo-1606471191009-63994c53433b',
'https://images.unsplash.com/photo-1562967914-608f82629710',
'https://images.unsplash.com/photo-1615486171448-4fbef0fc39c9',
'https://images.unsplash.com/photo-1572656306390-40a9fc3899f7',
'https://images.unsplash.com/photo-1579871494447-9811cf80d66c',
'https://images.unsplash.com/photo-1534083222144-f908759714da',
'https://images.unsplash.com/photo-1559483253-938221c97042',
'https://images.unsplash.com/photo-1569718212165-3a8278d5f624',
'https://images.unsplash.com/photo-1582733315328-84996963ef51',
'https://images.unsplash.com/photo-1615361200141-f45040f367be',
'https://images.unsplash.com/photo-1553621042-f6e147245754',
'https://images.unsplash.com/photo-1513104890138-7c749659a591',
'https://images.unsplash.com/photo-1574071318508-1cdbad80ad50',
'https://images.unsplash.com/photo-1628840042765-356cda07504e',
'https://images.unsplash.com/photo-1612450866873-196024ef482d',
'https://images.unsplash.com/photo-1571877223202-556260842db3',
'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c',
'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38',
'https://images.unsplash.com/photo-1563805042-7684c8a9e9ce',
'https://images.unsplash.com/photo-1582878826629-29b7ad4f39fb',
'https://images.unsplash.com/photo-1632709664539-72c1c3fcd105',
'https://images.unsplash.com/photo-1596624522923-288339dc8399',
'https://images.unsplash.com/photo-1582285145802-99bd850e0544',
'https://images.unsplash.com/photo-1627308595229-7830f5c95f9d',
'https://images.unsplash.com/photo-1556679343-c7306c1976bc',
'https://images.unsplash.com/photo-1601050690597-df0568f70950',
'https://images.unsplash.com/photo-1571091718767-18b5b1457add'
];

async function check() {
  for (const url of new Set(urls)) {
    try {
      const res = await fetch(url);
      if (res.status === 404) {
        console.log('404:', url);
      }
    } catch (e) {
      console.log('Error:', url, e.message);
    }
  }
}
check();
