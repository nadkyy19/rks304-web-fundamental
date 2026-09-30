document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('registerForm');

  var today = new Date();
  var todayStr = today.getFullYear() + '-' +
    String(today.getMonth() + 1).padStart(2, '0') + '-' +
    String(today.getDate()).padStart(2, '0');
  document.getElementById('tanggal_lahir').setAttribute('max', todayStr);

  var rules = {
    username: function (v) {
      if (v.trim() === '') return 'Username tidak boleh kosong.';
      if (v.trim().length < 3) return 'Username minimal 3 karakter.';
      return '';
    },
    password: function (v) {
      if (v === '') return 'Password tidak boleh kosong.';
      if (v.length < 8) return 'Password minimal 8 karakter.';
      return '';
    },
    nama: function (v) {
      if (v.trim() === '') return 'Nama tidak boleh kosong.';
      return '';
    },
    tanggal_lahir: function (v) {
      if (v === '') return 'Tanggal lahir tidak boleh kosong.';
      if (v > todayStr) return 'Tanggal lahir tidak boleh di masa depan.';
      return '';
    },
    alamat: function (v) {
      if (v.trim() === '') return 'Alamat tidak boleh kosong.';
      return '';
    },
    telepon: function (v) {
      if (v.trim() === '') return 'Nomor telepon tidak boleh kosong.';
      if (!v.trim().startsWith('62')) return 'Nomor telepon harus diawali 62.';
      return '';
    }
  };

  function showError(id, message) {
    var input = document.getElementById(id);
    var error = document.getElementById(id + '-error');
    if (message) {
      error.textContent = message;
      error.classList.remove('hidden');
      input.classList.add('border-rose-400');
      input.classList.remove('border-slate-200');
    } else {
      error.textContent = '';
      error.classList.add('hidden');
      input.classList.remove('border-rose-400');
      input.classList.add('border-slate-200');
    }
  }

  function validateField(id) {
    var message = rules[id](document.getElementById(id).value);
    showError(id, message);
    return message === '';
  }

  // Event handling: validasi saat keluar field (blur) dan saat mengetik (input)
  Object.keys(rules).forEach(function (id) {
    var el = document.getElementById(id);
    el.addEventListener('blur', function () { validateField(id); });
    el.addEventListener('input', function () { validateField(id); });
    el.addEventListener('change', function () { validateField(id); });
  });

  // Event handling: validasi semua field saat submit
  form.addEventListener('submit', function (e) {
    var valid = true;
    var firstInvalid = null;

    Object.keys(rules).forEach(function (id) {
      if (!validateField(id)) {
        valid = false;
        if (!firstInvalid) firstInvalid = id;
      }
    });

    if (!valid) {
      e.preventDefault(); // batalkan submit, tetap di halaman
      document.getElementById(firstInvalid).focus();
    }
    if (valid) {
      // simpan akun agar bisa dipakai login di index.html
      var users = [];
      try { users = JSON.parse(localStorage.getItem('users')) || []; } catch (err) {}
      users = users.filter(function (u) { return u.username !== document.getElementById('username').value.trim(); });
      users.push({
        username: document.getElementById('username').value.trim(),
        password: document.getElementById('password').value,
        nama: document.getElementById('nama').value.trim()
      });
      localStorage.setItem('users', JSON.stringify(users));
      sessionStorage.setItem('loggedInUser', document.getElementById('username').value.trim());
    }
    // jika valid, form lanjut ke action="dashboard.html"
  });
});