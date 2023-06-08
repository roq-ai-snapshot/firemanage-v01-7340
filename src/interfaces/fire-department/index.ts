import { IncidentInterface } from 'interfaces/incident';
import { ResourceInterface } from 'interfaces/resource';
import { TrainingProgramInterface } from 'interfaces/training-program';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface FireDepartmentInterface {
  id?: string;
  name: string;
  description?: string;
  image?: string;
  created_at?: Date;
  updated_at?: Date;
  user_id: string;
  tenant_id: string;
  incident?: IncidentInterface[];
  resource?: ResourceInterface[];
  training_program?: TrainingProgramInterface[];
  user?: UserInterface;
  _count?: {
    incident?: number;
    resource?: number;
    training_program?: number;
  };
}

export interface FireDepartmentGetQueryInterface extends GetQueryInterface {
  filter: {
    id?: string;
    name?: string;
    description?: string;
    image?: string;
    user_id?: string;
    tenant_id?: string;
  };
}
