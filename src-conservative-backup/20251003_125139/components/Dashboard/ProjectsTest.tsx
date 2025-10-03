'use client';

import React, { useState } from 'react';
import {
  testProjectsConnection,
  saveProjectMain,
  loadProjectsMain,
  updateProjectMain,
  deleteProjectMain,
  saveProjectObjective,
  loadProjectObjectives,
  saveProjectBudget,
  loadProjectBudget,
  saveProjectTeam,
  loadProjectTeam,
  saveProjectMilestone,
  loadProjectMilestones,
  saveProjectRisk,
  loadProjectRisks,
  ProjectMain,
  ProjectObjective,
  ProjectBudget,
  ProjectTeam,
  ProjectMilestone,
  ProjectRisk
} from '@/lib/supabase';

export default function ProjectsTest() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const runAllTests = async () => {
    setLoading(true);
    setTestResults([]);
    const results: any[] = [];

    // Test 1: Connection
    try {
      const connResult = await testProjectsConnection();
      results.push({
        name: 'Connessione Database',
        status: connResult.success ? 'SUCCESS' : 'ERROR',
        message: connResult.message,
        details: connResult.data
      });
    } catch (error: any) {
      results.push({
        name: 'Connessione Database',
        status: 'ERROR',
        message: `Errore di connessione: ${error.message}`,
        details: error
      });
    }

    // Test 2: Save Project Main
    try {
      const newProject: Omit<ProjectMain, 'id' | 'created_at' | 'updated_at'> = {
        user_id: 'test-user',
        name: 'Test Project CRUD',
        description: 'Progetto per testare tutte le operazioni CRUD',
        status: 'active',
        priority: 'high',
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        budget: 50000.00,
        currency: 'EUR',
        project_manager: 'Test Manager',
        team_members: ['Developer 1', 'Developer 2'],
        completion_percentage: 0,
        tags: ['test', 'crud', 'development'],
        notes: 'Progetto di test per verificare funzionalità'
      };
      const savedProject = await saveProjectMain(newProject);
      results.push({
        name: 'Salvataggio Project Main',
        status: 'SUCCESS',
        message: `Project salvato con ID: ${savedProject.id}`,
        details: savedProject
      });

      // Test 3: Save Project Objective
      try {
        const newObjective: Omit<ProjectObjective, 'id' | 'created_at' | 'updated_at'> = {
          project_id: savedProject.id,
          user_id: 'test-user',
          title: 'Test Objective',
          description: 'Obiettivo di test per il progetto',
          objective_type: 'milestone',
          priority: 'high',
          status: 'pending',
          target_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
          target_value: 100,
          actual_value: 0,
          unit_of_measure: 'percent',
          progress_percentage: 0,
          success_criteria: 'Completamento al 100%',
          dependencies: [],
          responsible_person: 'Test Manager',
          notes: 'Obiettivo di test'
        };
        const savedObjective = await saveProjectObjective(newObjective);
        results.push({
          name: 'Salvataggio Project Objective',
          status: 'SUCCESS',
          message: `Objective salvato con ID: ${savedObjective.id}`,
          details: savedObjective
        });
      } catch (error: any) {
        results.push({
          name: 'Salvataggio Project Objective',
          status: 'ERROR',
          message: `Errore salvataggio Objective: ${error.message}`,
          details: error
        });
      }

      // Test 4: Save Project Budget
      try {
        const newBudget: Omit<ProjectBudget, 'id' | 'created_at' | 'updated_at'> = {
          project_id: savedProject.id,
          user_id: 'test-user',
          category: 'personnel',
          item_name: 'Test Budget Item',
          description: 'Elemento di budget per test',
          estimated_cost: 10000.00,
          actual_cost: 0,
          currency: 'EUR',
          planned_date: new Date().toISOString(),
          status: 'planned',
          payment_status: 'pending',
          vendor: 'Test Vendor',
          notes: 'Budget item di test'
        };
        const savedBudget = await saveProjectBudget(newBudget);
        results.push({
          name: 'Salvataggio Project Budget',
          status: 'SUCCESS',
          message: `Budget salvato con ID: ${savedBudget.id}`,
          details: savedBudget
        });
      } catch (error: any) {
        results.push({
          name: 'Salvataggio Project Budget',
          status: 'ERROR',
          message: `Errore salvataggio Budget: ${error.message}`,
          details: error
        });
      }

      // Test 5: Save Project Team
      try {
        const newTeam: Omit<ProjectTeam, 'id' | 'created_at' | 'updated_at'> = {
          project_id: savedProject.id,
          user_id: 'test-user',
          member_name: 'Test Developer',
          role: 'Full Stack Developer',
          department: 'Engineering',
          email: 'test@example.com',
          allocation_percentage: 100,
          hourly_rate: 50.00,
          currency: 'EUR',
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'active',
          skills: ['React', 'Node.js', 'TypeScript'],
          responsibilities: 'Sviluppo frontend e backend',
          notes: 'Membro del team di test'
        };
        const savedTeam = await saveProjectTeam(newTeam);
        results.push({
          name: 'Salvataggio Project Team',
          status: 'SUCCESS',
          message: `Team salvato con ID: ${savedTeam.id}`,
          details: savedTeam
        });
      } catch (error: any) {
        results.push({
          name: 'Salvataggio Project Team',
          status: 'ERROR',
          message: `Errore salvataggio Team: ${error.message}`,
          details: error
        });
      }

      // Test 6: Save Project Milestone
      try {
        const newMilestone: Omit<ProjectMilestone, 'id' | 'created_at' | 'updated_at'> = {
          project_id: savedProject.id,
          user_id: 'test-user',
          title: 'Test Milestone',
          description: 'Milestone di test per il progetto',
          milestone_type: 'milestone',
          planned_date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'pending',
          dependencies: [],
          deliverables: ['Test Deliverable 1', 'Test Deliverable 2'],
          responsible_person: 'Test Manager',
          notes: 'Milestone di test'
        };
        const savedMilestone = await saveProjectMilestone(newMilestone);
        results.push({
          name: 'Salvataggio Project Milestone',
          status: 'SUCCESS',
          message: `Milestone salvata con ID: ${savedMilestone.id}`,
          details: savedMilestone
        });
      } catch (error: any) {
        results.push({
          name: 'Salvataggio Project Milestone',
          status: 'ERROR',
          message: `Errore salvataggio Milestone: ${error.message}`,
          details: error
        });
      }

      // Test 7: Save Project Risk
      try {
        const newRisk: Omit<ProjectRisk, 'id' | 'created_at' | 'updated_at'> = {
          project_id: savedProject.id,
          user_id: 'test-user',
          title: 'Test Risk',
          description: 'Rischio di test per il progetto',
          risk_type: 'technical',
          probability: 'medium',
          impact: 'high',
          risk_level: 'high',
          status: 'identified',
          mitigation_strategy: 'Implementare test automatici',
          contingency_plan: 'Rollback al sistema precedente',
          owner: 'Test Manager',
          identified_date: new Date().toISOString(),
          target_resolution_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
          notes: 'Rischio di test'
        };
        const savedRisk = await saveProjectRisk(newRisk);
        results.push({
          name: 'Salvataggio Project Risk',
          status: 'SUCCESS',
          message: `Risk salvato con ID: ${savedRisk.id}`,
          details: savedRisk
        });
      } catch (error: any) {
        results.push({
          name: 'Salvataggio Project Risk',
          status: 'ERROR',
          message: `Errore salvataggio Risk: ${error.message}`,
          details: error
        });
      }

      // Test 8: Load Project Objectives
      try {
        const loadedObjectives = await loadProjectObjectives(savedProject.id);
        results.push({
          name: 'Caricamento Project Objectives',
          status: 'SUCCESS',
          message: `Caricati ${loadedObjectives.length} objectives`,
          details: loadedObjectives
        });
      } catch (error: any) {
        results.push({
          name: 'Caricamento Project Objectives',
          status: 'ERROR',
          message: `Errore caricamento Objectives: ${error.message}`,
          details: error
        });
      }

      // Test 9: Load Project Budget
      try {
        const loadedBudget = await loadProjectBudget(savedProject.id);
        results.push({
          name: 'Caricamento Project Budget',
          status: 'SUCCESS',
          message: `Caricati ${loadedBudget.length} budget items`,
          details: loadedBudget
        });
      } catch (error: any) {
        results.push({
          name: 'Caricamento Project Budget',
          status: 'ERROR',
          message: `Errore caricamento Budget: ${error.message}`,
          details: error
        });
      }

      // Test 10: Load Project Team
      try {
        const loadedTeam = await loadProjectTeam(savedProject.id);
        results.push({
          name: 'Caricamento Project Team',
          status: 'SUCCESS',
          message: `Caricati ${loadedTeam.length} team members`,
          details: loadedTeam
        });
      } catch (error: any) {
        results.push({
          name: 'Caricamento Project Team',
          status: 'ERROR',
          message: `Errore caricamento Team: ${error.message}`,
          details: error
        });
      }

      // Test 11: Load Project Milestones
      try {
        const loadedMilestones = await loadProjectMilestones(savedProject.id);
        results.push({
          name: 'Caricamento Project Milestones',
          status: 'SUCCESS',
          message: `Caricate ${loadedMilestones.length} milestones`,
          details: loadedMilestones
        });
      } catch (error: any) {
        results.push({
          name: 'Caricamento Project Milestones',
          status: 'ERROR',
          message: `Errore caricamento Milestones: ${error.message}`,
          details: error
        });
      }

      // Test 12: Load Project Risks
      try {
        const loadedRisks = await loadProjectRisks(savedProject.id);
        results.push({
          name: 'Caricamento Project Risks',
          status: 'SUCCESS',
          message: `Caricati ${loadedRisks.length} risks`,
          details: loadedRisks
        });
      } catch (error: any) {
        results.push({
          name: 'Caricamento Project Risks',
          status: 'ERROR',
          message: `Errore caricamento Risks: ${error.message}`,
          details: error
        });
      }

      // Test 13: Update Project Main
      try {
        const updatedProject = await updateProjectMain(savedProject.id, {
          completion_percentage: 25,
          notes: 'Progetto aggiornato durante il test'
        });
        results.push({
          name: 'Aggiornamento Project Main',
          status: 'SUCCESS',
          message: `Project aggiornato con progresso: ${updatedProject.completion_percentage}%`,
          details: updatedProject
        });
      } catch (error: any) {
        results.push({
          name: 'Aggiornamento Project Main',
          status: 'ERROR',
          message: `Errore aggiornamento Project: ${error.message}`,
          details: error
        });
      }

      // Test 14: Load All Projects
      try {
        const allProjects = await loadProjectsMain('test-user');
        results.push({
          name: 'Caricamento Tutti i Projects',
          status: 'SUCCESS',
          message: `Caricati ${allProjects.length} projects totali`,
          details: allProjects
        });
      } catch (error: any) {
        results.push({
          name: 'Caricamento Tutti i Projects',
          status: 'ERROR',
          message: `Errore caricamento Projects: ${error.message}`,
          details: error
        });
      }

      // Test 15: Delete Project (Cleanup)
      try {
        await deleteProjectMain(savedProject.id);
        results.push({
          name: 'Eliminazione Project (Cleanup)',
          status: 'SUCCESS',
          message: `Project eliminato con successo`,
          details: { deletedId: savedProject.id }
        });
      } catch (error: any) {
        results.push({
          name: 'Eliminazione Project (Cleanup)',
          status: 'ERROR',
          message: `Errore eliminazione Project: ${error.message}`,
          details: error
        });
      }

    } catch (error: any) {
      results.push({
        name: 'Salvataggio Project Main',
        status: 'ERROR',
        message: `Errore salvataggio Project: ${error.message}`,
        details: error
      });
    }

    setTestResults(results);
    setLoading(false);
  };

  return (
    <div className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">🧪 Test Database Projects</h2>
      <p className="text-gray-600 mb-4">
        Esegui i test per verificare la connessione e le operazioni CRUD (Create, Read, Update, Delete)
        per tutte le tabelle dei progetti: projects_main, project_objectives, project_budget, 
        project_team, project_milestones, project_risks.
      </p>
      <button
        onClick={runAllTests}
        disabled={loading}
        className={`px-6 py-3 rounded-lg font-medium transition-colors ${
          loading
            ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {loading ? 'Esecuzione test...' : 'Avvia Test Completo Projects'}
      </button>

      {testResults.length > 0 && (
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Risultati Test:</h3>
          {testResults.map((result, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                result.status === 'SUCCESS' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`font-medium ${result.status === 'SUCCESS' ? 'text-green-800' : 'text-red-800'}`}>
                  {result.status === 'SUCCESS' ? '✅' : '❌'} {result.name}
                </span>
                <span className={`text-sm ${result.status === 'SUCCESS' ? 'text-green-600' : 'text-red-600'}`}>
                  {result.status}
                </span>
              </div>
              <p className="text-gray-700 mt-1 text-sm">{result.message}</p>
              {result.details && (
                <pre className="mt-2 p-2 bg-gray-100 rounded-md text-xs text-gray-800 overflow-x-auto">
                  {JSON.stringify(result.details, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
