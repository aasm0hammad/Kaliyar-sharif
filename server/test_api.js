(async () => {
  try {
    const res = await fetch('http://localhost:5000/api/users/1/profile');
    console.log(res.status);
    const text = await res.text();
    console.log(text.substring(0, 200));
  } catch (err) {
    console.log(err);
  }
})();
