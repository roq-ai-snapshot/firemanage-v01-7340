import { IncidentInterface } from 'interfaces/incident';
import { ResourceInterface } from 'interfaces/resource';
import { GetQueryInterface } from 'interfaces';

export interface IncidentResourceInterface {
  id?: string;
  incident_id: string;
  resource_id: string;
  created_at?: Date;
  updated_at?: Date;

  incident?: IncidentInterface;
  resource?: ResourceInterface;
  _count?: {};
}

export interface IncidentResourceGetQueryInterface extends GetQueryInterface {
  filter: {
    id?: string;
    incident_id?: string;
    resource_id?: string;
  };
}
