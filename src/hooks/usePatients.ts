import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Patient, Session, PatientFormData, SessionFormData, PatientStatusHistory, TreatmentStatus } from '@/types';

export function usePatients() {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPatients();
      fetchSessions();
    } else {
      setPatients([]);
      setSessions([]);
      setLoading(false);
    }
  }, [user]);

  const fetchPatients = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPatients(data as Patient[]);
    }
    setLoading(false);
  };

  const fetchSessions = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .order('date', { ascending: false });

    if (!error && data) {
      setSessions(data as Session[]);
    }
  };

  const addPatient = async (patientData: PatientFormData) => {
    if (!user) return { error: new Error('Usuário não autenticado'), data: null };

    const { data, error } = await supabase
      .from('patients')
      .insert({
        user_id: user.id,
        name: patientData.name,
        cpf: patientData.cpf,
        birth_date: patientData.birth_date,
        address: patientData.address || null,
        city: patientData.city || null,
        state: patientData.state || null,
        zip_code: patientData.zip_code || null,
        phone: patientData.phone || null,
        email: patientData.email || null,
        profession: patientData.profession || null,
        is_minor: patientData.is_minor,
        guardian_name: patientData.guardian_name || null,
        guardian_cpf: patientData.guardian_cpf || null,
        guardian_phone: patientData.guardian_phone || null,
        guardian_relationship: patientData.guardian_relationship || null,
      })
      .select()
      .single();

    if (!error) {
      await fetchPatients();
    }

    return { error, data: data as Patient | null };
  };

  const updatePatient = async (id: string, patientData: Partial<PatientFormData>) => {
    const { error } = await supabase
      .from('patients')
      .update(patientData)
      .eq('id', id);

    if (!error) {
      await fetchPatients();
    }

    return { error };
  };

  const deletePatient = async (id: string) => {
    const { error } = await supabase
      .from('patients')
      .delete()
      .eq('id', id);

    if (!error) {
      await fetchPatients();
      await fetchSessions();
    }

    return { error };
  };

  const getPatient = (id: string) => {
    return patients.find(p => p.id === id);
  };

  const updatePatientStatus = async (
    patientId: string, 
    status: TreatmentStatus, 
    reason: string, 
    notes?: string
  ) => {
    if (!user) return { error: new Error('Usuário não autenticado') };

    // Update patient status
    const { error: updateError } = await supabase
      .from('patients')
      .update({ current_status: status })
      .eq('id', patientId);

    if (updateError) return { error: updateError };

    // Add to history
    const { error: historyError } = await supabase
      .from('patient_status_history')
      .insert({
        patient_id: patientId,
        status,
        reason,
        notes: notes || null,
        created_by: user.id,
      });

    if (!historyError) {
      await fetchPatients();
    }

    return { error: historyError };
  };

  const getPatientStatusHistory = async (patientId: string) => {
    const { data, error } = await supabase
      .from('patient_status_history')
      .select('*')
      .eq('patient_id', patientId)
      .order('changed_at', { ascending: false });

    return { data: data as PatientStatusHistory[] | null, error };
  };

  const addSession = async (patientId: string, sessionData: SessionFormData) => {
    if (!user) return { error: new Error('Usuário não autenticado'), data: null };

    const { data, error } = await supabase
      .from('sessions')
      .insert({
        patient_id: patientId,
        user_id: user.id,
        session_type: sessionData.session_type,
        date: sessionData.date,
        time: sessionData.time,
        duration_minutes: sessionData.duration_minutes,
        modality: sessionData.modality,
        topics: sessionData.topics,
        sleep_pattern: sessionData.sleep_pattern || null,
        mood: sessionData.mood,
        eating: sessionData.eating || null,
        medication_status: sessionData.medication_status || null,
        medication_new: sessionData.medication_new || null,
        approach: sessionData.approach as any || null,
        techniques: sessionData.techniques,
        dsm_diagnosis: sessionData.dsm_diagnosis,
        cid_diagnosis: sessionData.cid_diagnosis,
        clinical_observations: sessionData.clinical_observations || null,
        clinical_hypotheses: sessionData.clinical_hypotheses || null,
        observed_progress: sessionData.observed_progress || null,
        interventions: sessionData.interventions || null,
        referral_needed: sessionData.referral_needed,
        referral_to: sessionData.referral_to || null,
        referral_reason: sessionData.referral_reason || null,
        main_complaint: sessionData.main_complaint || null,
        complaint_history: sessionData.complaint_history || null,
        relevant_history: sessionData.relevant_history || null,
        therapeutic_goals: sessionData.therapeutic_goals || null,
        treatment_plan: sessionData.treatment_plan || null,
        notes: sessionData.notes || null,
      })
      .select()
      .single();

    if (!error) {
      await fetchSessions();
    }

    return { error, data: data as Session | null };
  };

  const updateSession = async (id: string, sessionData: Partial<SessionFormData>) => {
    const updateData: Record<string, any> = { ...sessionData };
    if (updateData.approach) {
      updateData.approach = updateData.approach as any;
    }
    
    const { error } = await supabase
      .from('sessions')
      .update(updateData)
      .eq('id', id);

    if (!error) {
      await fetchSessions();
    }

    return { error };
  };

  const deleteSession = async (id: string) => {
    const { error } = await supabase
      .from('sessions')
      .delete()
      .eq('id', id);

    if (!error) {
      await fetchSessions();
    }

    return { error };
  };

  const getPatientSessions = (patientId: string) => {
    return sessions
      .filter(s => s.patient_id === patientId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const getSession = (sessionId: string) => {
    return sessions.find(s => s.id === sessionId);
  };

  return {
    patients,
    sessions,
    loading,
    addPatient,
    updatePatient,
    deletePatient,
    getPatient,
    updatePatientStatus,
    getPatientStatusHistory,
    addSession,
    updateSession,
    deleteSession,
    getPatientSessions,
    getSession,
    refetch: () => {
      fetchPatients();
      fetchSessions();
    },
  };
}
