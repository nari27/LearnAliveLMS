import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/CreateProfessor.module.css"; 

const CreateProfessor = ({ professor, onClose, onProfessorAdded, onProfessorUpdated }) => {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [email, setEmail] = useState("");
  const [profId, setProfId] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [university, setUniversity] = useState(""); 

  useEffect(() => {
    if (professor) {
      setProfId(professor.prof_id);
      setName(professor.name);
      setDepartment(professor.department);
      setEmail(professor.email);
      setPhone(professor.phone || "");
      setUniversity(professor.university || "");
      setCurrentPassword(professor.password || "");
    } else {
      setProfId("");
      setName("");
      setDepartment("");
      setEmail("");
      setPhone("");
      setUniversity("");
      setCurrentPassword("");
    }
  }, [professor]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const professorData = {
      prof_id: profId,
      name,
      university,
      department,
      email: email.trim() === "" ? null : email,
      password: currentPassword,
      phone: phone.trim() === "" ? null : phone,
    };

    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      let response;
      if (professor) {
        response = await axios.put(
          `http://localhost:8080/api/professors/${professor.prof_id}`,
          professorData,
          { headers }
        );
        onProfessorUpdated && onProfessorUpdated(response.data);
      } else {
        response = await axios.post(
          "http://localhost:8080/api/professors/add",
          professorData,
          { headers }
        );
        onProfessorAdded && onProfessorAdded(response.data);
      }
      onClose();
    } catch (error) {
      console.error("교수자 생성/수정 실패", error.response ? error.response.data : error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '80%', margin: '0 auto', padding: '2rem', backgroundColor: 'white', borderRadius: '10px' }}>
      <div className={styles.formGroup}>
        <label htmlFor="profId">교수자 ID :</label>
        <input type="text" id="profId" className={styles.formControl} value={profId} placeholder="ex : 20250323"
          onChange={(e) => setProfId(e.target.value)} disabled={!!professor} />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="name">성명 :</label>
        <input type="text" id="name" className={styles.formControl} value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="university">소속 대학 :</label>
        <input type="text" id="university" className={styles.formControl} value={university} onChange={(e) => setUniversity(e.target.value)} required />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="department">학과 :</label>
        <input type="text" id="department" className={styles.formControl} value={department} onChange={(e) => setDepartment(e.target.value)} required />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="email">이메일 :</label>
        <input type="email" id="email" className={styles.formControl} value={email} placeholder="ex : 1234@naver.com"
          onChange={(e) => setEmail(e.target.value)} required />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="phone">전화번호 :</label>
        <input type="text" id="phone" className={styles.formControl} value={phone} placeholder="ex : 010-xxxx-xxxx"
          onChange={(e) => setPhone(e.target.value)} required />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="currentPassword">{professor ? "현재 비밀번호 :" : "비밀번호 :"}</label>
        <input type="password" id="currentPassword" className={styles.formControl} value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)} required />
      </div>

      <div className={styles.buttonGroup}>
        <button type="submit" className="btn btn-primary">
          {professor ? "수정하기" : "교수자 생성"}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          취소
        </button>
      </div>
    </form>
  );
};

export default CreateProfessor;