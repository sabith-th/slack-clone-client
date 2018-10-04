import React from 'react';
import {
  Modal, Input, Button, Form, List,
} from 'semantic-ui-react';
import Downshift from 'downshift';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { getTeamMembersQuery } from '../graphql/team';

const DirectMessageModal = ({
  open,
  onClose,
  history,
  teamId,
  data: { loading, getTeamMembers },
}) => (
  <Modal open={open} onClose={onClose}>
    <Modal.Header>Direct Messages</Modal.Header>
    <Modal.Content>
      <Form>
        <Form.Field>
          {!loading && (
            <Downshift
              onChange={(selection) => {
                history.push(`/viewTeam/user/${teamId}/${selection.id}`);
                onClose();
              }}
              itemToString={item => (item ? item.username : '')}
            >
              {({
                getInputProps,
                getItemProps,
                getMenuProps,
                isOpen,
                inputValue,
                highlightedIndex,
                selectedItem,
              }) => (
                <div>
                  <Input {...getInputProps({ placeholder: 'Search by name' })} fluid />
                  <List {...getMenuProps()}>
                    {isOpen
                      ? getTeamMembers
                        .filter(
                          item => !inputValue
                              || item.username.toLowerCase().includes(inputValue.toLowerCase()),
                        )
                        .map((item, index) => (
                          <List.Item
                            {...getItemProps({
                              key: item.id,
                              index,
                              item,
                              style: {
                                backgroundColor:
                                    highlightedIndex === index ? 'lightgray' : 'white',
                                fontWeight: selectedItem === item ? 'bold' : 'normal',
                              },
                            })}
                          >
                            {item.username}
                          </List.Item>
                        ))
                      : null}
                  </List>
                </div>
              )}
            </Downshift>
          )}
        </Form.Field>
        <Form.Group widths="equal">
          <Button fluid onClick={onClose}>
            Cancel
          </Button>
        </Form.Group>
      </Form>
    </Modal.Content>
  </Modal>
);

export default withRouter(graphql(getTeamMembersQuery)(DirectMessageModal));
