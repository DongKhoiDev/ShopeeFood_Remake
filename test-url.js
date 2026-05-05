const url = "https://images.unsplash.com/photo-1582878826629-29b7ad4f39fb?auto=format&fit=crop&q=80&w=2000";
fetch(url).then(res => {
  console.log('Status', res.status);
}).catch(console.error);
