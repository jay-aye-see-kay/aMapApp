import React from 'react';
import { Alert, Button, Modal, Form } from 'react-bootstrap';
import gql from 'graphql-tag';
import { MutationFn } from 'react-apollo';
import { Formik, FormikActions, FormikProps, Field, ErrorMessage } from 'formik';

import { InsertBussinessComponent, InsertBussinessMutation, InsertBussinessMutationVariables } from '../generated/graphql';

const insertBussiness = gql`
  mutation insertBussiness ($lat: numeric!, $long: numeric!, $name: String!) {
    insert_businesses(objects: { lat: $lat, long: $long, name: $name }) {
      returning {
        id
        lat
        long
        name
      }
    }
  }
`;

type OuterProps = {
  show: boolean;
  onHide: () => void;
};

type InnerProps = OuterProps & {
  insertBussiness: MutationFn<InsertBussinessMutation, InsertBussinessMutationVariables>;
};

const initialValues = { lat: '', long: '', name: '' };
type FormValues = typeof initialValues;

const AddBussinessModalView = ({ show, onHide, insertBussiness }: InnerProps) => {

  const onSave = (values: FormValues, actions: FormikActions<FormValues>) => {
    console.log('actions', actions);
    console.log('values', values);
    insertBussiness({ variables: {  ...values } });
    onHide();
  }

  const validate = (values: FormValues) => {
    let errors: Partial<FormValues> = {};
    if (!values.name) {
      errors.name = 'A name is required';
    }

    const longNum = parseFloat(values.lat);
    if (isNaN(longNum) || longNum < -180 || longNum > 180) {
      errors.long = 'latitude must be between -180 and 180';
    }

    const latNum = parseFloat(values.lat);
    if (isNaN(latNum) || latNum < -90 || latNum > 90) {
      errors.lat = 'latitude must be between -90 and 90';
    }

    return errors;
  }

  return (
    <Modal show={show} onHide={onHide}>
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={onSave}
        render={({ handleReset, handleSubmit, handleChange, values, errors, touched, isValid }: FormikProps<FormValues>) => (
          <form onReset={handleReset} onSubmit={handleSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body>

              <Form.Group>
                <Form.Label>Businesses name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  isValid={touched.name && !errors.name}
                />
                <Form.Control.Feedback>{errors.name}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group>
                <Form.Label>Longitude</Form.Label>
                <Form.Control
                  type="text"
                  name="long"
                  value={values.long}
                  onChange={handleChange}
                  isValid={touched.long && !errors.long}
                />
                <Form.Control.Feedback>{errors.long}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group>
                <Form.Label>Latitude</Form.Label>
                <Form.Control
                  type="text"
                  name="lat"
                  value={values.lat}
                  onChange={handleChange}
                  isValid={touched.lat && !errors.lat}
                />
                <Form.Control.Feedback>{errors.lat}</Form.Control.Feedback>
              </Form.Group>

            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={onHide}>Close</Button>
              <Button variant="primary" type="submit">Save Changes</Button>
            </Modal.Footer>
          </form>
        )}
      />
    </Modal>
  );
};


export const AddBussinessModal = ({show, onHide}: OuterProps) => {
  return (
    <InsertBussinessComponent>
      {(insertBussiness) => (
        <AddBussinessModalView show={show} onHide={onHide} insertBussiness={insertBussiness} />
      )}
    </InsertBussinessComponent>
  );
};


