import { IncidentResourceInterface } from 'interfaces/incident-resource';
import { FireDepartmentInterface } from 'interfaces/fire-department';
import { GetQueryInterface } from 'interfaces';

export interface IncidentInterface {
  id?: string;
  name: string;
  status: string;
  fire_department_id: string;
  created_at?: Date;
  updated_at?: Date;
  incident_resource?: IncidentResourceInterface[];
  fire_department?: FireDepartmentInterface;
  _count?: {
    incident_resource?: number;
  };
}

export interface IncidentGetQueryInterface extends GetQueryInterface {
  filter: {
    id?: string;
    name?: string;
    status?: string;
    fire_department_id?: string;
  };
}
