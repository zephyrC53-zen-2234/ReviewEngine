'use client';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, LineChart, Line } from 'recharts';
export function ComparisonChart({ data, names }: {
    data: Record<string, string | number>[];
    names: string[];
}) { return <div className="chart" role="img" aria-label="Product rating comparison bar chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={data}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)"/><XAxis dataKey="dimension" tick={{ fontSize: 10, fill: 'var(--muted)' }}/><YAxis domain={[0, 5]} tick={{ fontSize: 10, fill: 'var(--muted)' }}/><Tooltip contentStyle={{ background: 'var(--panel)', borderColor: 'var(--border)', borderRadius: 10, color: 'var(--text)' }}/><Legend wrapperStyle={{ fontSize: 11 }}/>{names.map((name, i) => <Bar key={name} dataKey={name} fill={['#8b67e0', '#62aa92', '#e0a86d', '#7999ca'][i]} radius={[4, 4, 0, 0]}/>)}</BarChart></ResponsiveContainer></div>; }
export function ActivityChart({ data }: {
    data: {
        day: string;
        ratings: number;
    }[];
}) { return <div className="chart" role="img" aria-label="Daily rating activity over the last fourteen days"><ResponsiveContainer width="100%" height="100%"><LineChart data={data}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)"/><XAxis dataKey="day" tick={{ fontSize: 10, fill: 'var(--muted)' }}/><YAxis allowDecimals={false} tick={{ fontSize: 10, fill: 'var(--muted)' }}/><Tooltip contentStyle={{ background: 'var(--panel)', borderColor: 'var(--border)', color: 'var(--text)' }}/><Line type="monotone" dataKey="ratings" stroke="#9974e8" strokeWidth={3}/></LineChart></ResponsiveContainer></div>; }
