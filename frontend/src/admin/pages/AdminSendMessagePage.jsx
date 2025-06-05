// frontend/src/admin/pages/AdminSendMessagePage.jsx
import React, { useState, useEffect } from 'react';
import { getAllUsersProfilesAdmin, sendMessageToUserByAdmin } from '../services/adminService';
import { showSuccessToast, showErrorToast, showInfoToast } from '../../utils/toastHelper';
import './AdminSendMessagePage.css'; // Kita akan buat file CSS ini

function AdminSendMessagePage() {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [subject, setSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const response = await getAllUsersProfilesAdmin();
        setUsers(response.data.data || []);
      } catch (error) {
        console.error("Gagal memuat daftar pengguna:", error);
        showErrorToast("Gagal memuat daftar pengguna.");
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUserId || !subject.trim() || !messageBody.trim()) {
      showErrorToast("Pilih pengguna, subjek, dan isi pesan tidak boleh kosong.");
      return;
    }
    setIsSending(true);
    try {
      await sendMessageToUserByAdmin({
        targetUserId: selectedUserId,
        subject: subject.trim(),
        messageBody: messageBody.trim()
      });
      showSuccessToast("Pesan berhasil dikirim!");
      setSelectedUserId('');
      setSubject('');
      setMessageBody('');
    } catch (error) {
      console.error("Gagal mengirim pesan:", error);
      showErrorToast(error.response?.data?.message || "Gagal mengirim pesan.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="admin-send-message-page">
      <div className="page-header-admin">
        <h1>Kirim Pesan ke Pengguna</h1>
      </div>

      <form onSubmit={handleSubmit} className="send-message-form">
        <div className="form-group-admin">
          <label htmlFor="targetUser">Kirim ke Pengguna:</label>
          {loadingUsers ? (
            <p>Memuat pengguna...</p>
          ) : (
            <select 
              id="targetUser" 
              value={selectedUserId} 
              onChange={(e) => setSelectedUserId(e.target.value)}
              required
            >
              <option value="">-- Pilih Pengguna --</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.namaLengkap || user.email} ({user.namaToko || 'Belum ada toko'}) - {user.email}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="form-group-admin">
          <label htmlFor="subject">Subjek Email:</label>
          <input 
            type="text" 
            id="subject" 
            value={subject} 
            onChange={(e) => setSubject(e.target.value)} 
            required 
          />
        </div>

        <div className="form-group-admin">
          <label htmlFor="messageBody">Isi Pesan:</label>
          <textarea 
            id="messageBody" 
            value={messageBody} 
            onChange={(e) => setMessageBody(e.target.value)} 
            rows="8" 
            required
          ></textarea>
        </div>

        <button type="submit" className="button-send-message" disabled={isSending || loadingUsers}>
          {isSending ? 'Mengirim...' : 'Kirim Pesan'}
        </button>
      </form>
    </div>
  );
}

export default AdminSendMessagePage;