const mapping: Record<string, string> = {
  'fire-departments': 'fire_department',
  incidents: 'incident',
  'incident-resources': 'incident_resource',
  resources: 'resource',
  'training-programs': 'training_program',
  users: 'user',
  'user-training-programs': 'user_training_program',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
