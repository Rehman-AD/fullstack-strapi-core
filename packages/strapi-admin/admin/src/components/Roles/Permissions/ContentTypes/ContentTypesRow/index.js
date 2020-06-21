import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Checkbox, Flex, Text, Padded } from '@buffetjs/core';

import { getAttributesToDisplay } from '../../../../../utils';
import { usePermissionsContext } from '../../../../../hooks';
import {
  ATTRIBUTES_PERMISSIONS_ACTIONS,
  isAttributeAction,
  getAttributePermissionsSizeByContentTypeAction,
  getAllAttributesActionsSize,
  getAttributesByModel,
} from '../../utils';
import Chevron from './Chevron';
import PermissionCheckbox from '../PermissionCheckbox';
import PermissionName from './PermissionName';
import StyledRow from './StyledRow';
import ContentTypesAttributes from './ContentTypesAttributes';
import PermissionWrapper from './PermissionWrapper';
import CollapseLabel from '../CollapseLabel';

const ContentTypeRow = ({ index, contentType, contentTypesPermissionsLayout }) => {
  const {
    collapsePath,
    onCollapse,
    permissions,
    components,
    onAllContentTypeActions,
  } = usePermissionsContext();
  const isActive = collapsePath[0] === contentType.uid;
  const allCurrentActionsSize =
    getAllAttributesActionsSize(contentType.uid, permissions) +
    Object.values(get(permissions, [contentType.uid, 'contentTypeActions'], {})).filter(
      action => !!action
    ).length;

  const attributesToDisplay = useMemo(() => {
    return getAttributesToDisplay(contentType);
  }, [contentType]);

  const getAttributes = useCallback(() => {
    return getAttributesByModel(contentType, components);
  }, [contentType, components]);

  const allActionsSize =
    getAttributes().length * ATTRIBUTES_PERMISSIONS_ACTIONS.length -
    (ATTRIBUTES_PERMISSIONS_ACTIONS.length - contentTypesPermissionsLayout.length);

  const canSelectContentTypeActions = useCallback(
    action => get(permissions, [contentType.uid, 'contentTypeActions', action], false),
    [permissions, contentType]
  );

  const hasAllAttributeByAction = useCallback(
    action =>
      getAttributePermissionsSizeByContentTypeAction(permissions, contentType.uid, action) ===
      getAttributes().length,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [permissions, contentType]
  );

  const hasSomeAttributeByAction = useCallback(
    action =>
      getAttributePermissionsSizeByContentTypeAction(permissions, contentType.uid, action) > 0 &&
      getAttributePermissionsSizeByContentTypeAction(permissions, contentType.uid, action) <
        getAttributes().length,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [permissions, contentType]
  );

  const handleToggleAttributes = () => {
    onCollapse(0, contentType.uid);
  };

  const handleAllContentTypeActions = () => {
    onAllContentTypeActions({
      subject: contentType.uid,
      attributes: getAttributesByModel(contentType, components),
      shouldEnable: allCurrentActionsSize < allActionsSize,
      addContentTypeActions: true,
    });
  };

  return (
    <>
      <StyledRow isActive={isActive} isGrey={index % 2 === 0}>
        <Flex style={{ flex: 1 }}>
          <Padded left size="sm" />
          <PermissionName>
            <Checkbox
              onChange={handleAllContentTypeActions}
              name={contentType.name}
              someChecked={allCurrentActionsSize > 0 && allCurrentActionsSize < allActionsSize}
              value={allCurrentActionsSize === allActionsSize}
            />
            <CollapseLabel
              title={contentType.name}
              alignItems="center"
              isCollapsable
              onClick={handleToggleAttributes}
            >
              <Text
                color="grey"
                ellipsis
                fontSize="xs"
                fontWeight="bold"
                lineHeight="20px"
                textTransform="uppercase"
              >
                {contentType.name}
              </Text>
              <Chevron icon={isActive ? 'chevron-up' : 'chevron-down'} />
            </CollapseLabel>
          </PermissionName>
          <PermissionWrapper>
            {contentTypesPermissionsLayout.map(permissionLayout =>
              !isAttributeAction(permissionLayout.action) ? (
                <PermissionCheckbox
                  key={permissionLayout.action}
                  disabled
                  value={canSelectContentTypeActions(permissionLayout.action)}
                  hasConditions={false}
                  name={`${contentType.name}-${permissionLayout.action}`}
                />
              ) : (
                <PermissionCheckbox
                  key={permissionLayout.action}
                  disabled
                  value={hasAllAttributeByAction(permissionLayout.action)}
                  someChecked={hasSomeAttributeByAction(permissionLayout.action)}
                  hasConditions={false}
                  name={`${contentType.name}-${permissionLayout.action}`}
                />
              )
            )}
          </PermissionWrapper>
        </Flex>
      </StyledRow>
      {isActive && (
        <ContentTypesAttributes contentType={contentType} attributes={attributesToDisplay} />
      )}
    </>
  );
};

ContentTypeRow.propTypes = {
  contentType: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  contentTypesPermissionsLayout: PropTypes.array.isRequired,
};

export default ContentTypeRow;
