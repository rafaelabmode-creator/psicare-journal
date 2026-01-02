import { useState, useEffect } from 'react';
import { Patient, Session } from '@/types';

const PATIENTS_KEY = 'psychology-patients';
const SESSIONS_KEY = 'psychology-sessions';

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    const storedPatients = localStorage.getItem(PATIENTS_KEY);
    const storedSessions = localStorage.getItem(SESSIONS_KEY);
    
    if (storedPatients) {
      setPatients(JSON.parse(storedPatients));
    }
    if (storedSessions) {
      setSessions(JSON.parse(storedSessions));
    }
  }, []);

  const savePatients = (newPatients: Patient[]) => {
    localStorage.setItem(PATIENTS_KEY, JSON.stringify(newPatients));
    setPatients(newPatients);
  };

  const saveSessions = (newSessions: Session[]) => {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(newSessions));
    setSessions(newSessions);
  };

  const addPatient = (patient: Omit<Patient, 'id' | 'createdAt'>) => {
    const newPatient: Patient = {
      ...patient,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    savePatients([...patients, newPatient]);
    return newPatient;
  };

  const updatePatient = (id: string, data: Partial<Patient>) => {
    const updated = patients.map(p => 
      p.id === id ? { ...p, ...data } : p
    );
    savePatients(updated);
  };

  const deletePatient = (id: string) => {
    savePatients(patients.filter(p => p.id !== id));
    saveSessions(sessions.filter(s => s.patientId !== id));
  };

  const getPatient = (id: string) => {
    return patients.find(p => p.id === id);
  };

  const addSession = (session: Omit<Session, 'id' | 'createdAt'>) => {
    const newSession: Session = {
      ...session,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    saveSessions([...sessions, newSession]);
    return newSession;
  };

  const updateSession = (id: string, data: Partial<Session>) => {
    const updated = sessions.map(s => 
      s.id === id ? { ...s, ...data } : s
    );
    saveSessions(updated);
  };

  const deleteSession = (id: string) => {
    saveSessions(sessions.filter(s => s.id !== id));
  };

  const getPatientSessions = (patientId: string) => {
    return sessions
      .filter(s => s.patientId === patientId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  return {
    patients,
    sessions,
    addPatient,
    updatePatient,
    deletePatient,
    getPatient,
    addSession,
    updateSession,
    deleteSession,
    getPatientSessions,
  };
}
