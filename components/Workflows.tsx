import React, { useMemo, useState } from 'react';
import { Workflow, Zap, Plus, ArrowRight, CheckCircle2, Play, Pause } from 'lucide-react';
import { Workflow as WorkflowType } from '../types.ts';

type WorkflowsProps = {
  workflows?: WorkflowType[];
  onToggle?: (workflowId: string, nextIsActive: boolean) => void;
};

const defaultWorkflows: WorkflowType[] = [
  { id: '1', name: 'Auto-reply to 5-star reviews', trigger: 'NEW_REVIEW', condition: 'Rating equals 5', action: 'AUTO_REPLY', isActive: true },
  { id: '2', name: 'Alert Low Stock', trigger: 'LOW_STOCK', condition: 'Inventory < 5', action: 'NOTIFY_ADMIN', isActive: true },
  { id: '3', name: 'Thank You Email', trigger: 'NEW_ORDER', condition: 'Value > $100', action: 'SEND_EMAIL', isActive: false },
];

const Workflows: React.FC<WorkflowsProps> = ({ workflows: controlledWorkflows, onToggle }) => {
  const [localWorkflows, setLocalWorkflows] = useState<WorkflowType[]>(defaultWorkflows);
  const workflows = controlledWorkflows ?? localWorkflows;

  const handleToggle = (id: string) => {
    const current = workflows.find((w) => w.id === id);
    if (!current) return;
    const nextIsActive = !current.isActive;
    if (controlledWorkflows && onToggle) {
      onToggle(id, nextIsActive);
      return;
    }
    setLocalWorkflows((prev) => prev.map((w) => (w.id === id ? { ...w, isActive: nextIsActive } : w)));
  };

  const stats = useMemo(() => {
    const activeCount = (workflows || []).filter((w) => w.isActive).length;
    return { activeCount, total: workflows.length };
  }, [workflows]);

  return (
    <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Automation Workflows</h1>
                <p className="text-sm text-gray-500 mt-1">Set up "If This Then That" rules for your store.</p>
            </div>
            <button className="flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-black">
                <Plus className="w-4 h-4 mr-2" /> Create Workflow
            </button>
        </div>

        <div className="mb-6 text-xs text-gray-500">
          Active {stats.activeCount} / {stats.total}
        </div>

        <div className="space-y-4">
            {workflows.map(workflow => (
                <div key={workflow.id} className={`bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-all ${!workflow.isActive && 'opacity-60 grayscale'}`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className={`p-3 rounded-full ${workflow.isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                                <Zap className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">{workflow.name}</h3>
                                <div className="flex items-center text-sm text-gray-500 mt-1 space-x-2">
                                    <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-mono">IF {workflow.trigger}</span>
                                    <ArrowRight className="w-3 h-3" />
                                    <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-mono">{workflow.condition}</span>
                                    <ArrowRight className="w-3 h-3" />
                                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-bold font-mono">THEN {workflow.action}</span>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={() => handleToggle(workflow.id)}
                            className={`p-2 rounded-full border ${workflow.isActive ? 'border-green-200 bg-green-50 text-green-600 hover:bg-green-100' : 'border-gray-200 bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                            title={workflow.isActive ? "Pause" : "Activate"}
                        >
                            {workflow.isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            ))}
        </div>

        {/* Templates Section */}
        <div className="mt-12">
            <h3 className="font-bold text-gray-900 mb-4">Popular Templates</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['Win-back inactive customers', 'Post-purchase upsell email', 'Fraud detection alert'].map((t, i) => (
                    <div key={i} className="p-4 border border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-colors flex items-center justify-center text-center">
                        <span className="text-sm font-medium text-gray-600">{t}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default Workflows;