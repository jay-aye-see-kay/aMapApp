import React from 'react';
import { Alert, Button, Modal, Form } from 'react-bootstrap';
import gql from 'graphql-tag';
import { MutationFn } from 'react-apollo';
import { Formik, FormikActions, FormikProps } from 'formik';

import { businessFragment } from '../queries';
import { InsertBussinessComponent, InsertBussinessMutation, InsertBussinessMutationVariables } from '../generated/graphql';

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
        render={({ handleReset, handleSubmit, handleChange, values, errors, touched, setFieldValue }: FormikProps<FormValues>) => (
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
                {!!(touched.name && errors.name) && <Alert>{errors.name}</Alert>}
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
                {!!(touched.long && errors.long) && <Alert>{errors.long}</Alert>}
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
                {!!(touched.lat && errors.lat) && <Alert>{errors.lat}</Alert>}
              </Form.Group>

              <Button
                variant="secondary"
                onClick={() => {
                  const { lat, long } = generateRandomMelbourneGps();
                  setFieldValue('long', long);
                  setFieldValue('lat', lat);
                }}>
                Set random melbourne lat long
            </Button>

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


const insertBussiness = gql`
  mutation insertBussiness ($lat: numeric!, $long: numeric!, $name: String!) {
    insert_businesses(objects: { lat: $lat, long: $long, name: $name }) {
      returning {
        ...business
      }
    }
  }
  ${businessFragment}
`;

export const AddBussinessModal = ({show, onHide}: OuterProps) => {
  return (
    <InsertBussinessComponent>
      {(insertBussiness) => (
        <AddBussinessModalView show={show} onHide={onHide} insertBussiness={insertBussiness} />
      )}
    </InsertBussinessComponent>
  );
};

// tmp function for testing
const randBetween = (min: number, max: number) => {
  const randNum =  Math.random() * (min - max) + max;
  return parseFloat(randNum.toFixed(6));
}

const generateRandomMelbourneGps = () => {
  const minLat = -37.838496;
  const maxLat = -37.740402;
  const minLong = 144.894739;
  const maxLong = 145.015693;
  return {
    lat: randBetween(minLat, maxLat),
    long: randBetween(minLong, maxLong),
  };
}
