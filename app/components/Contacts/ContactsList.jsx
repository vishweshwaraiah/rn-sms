import React, { useEffect, useState, useCallback } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ContactItem from '@/components/Contacts/ContactItem';
import MasterInput from '../MasterInput';
import Colors from '@/utils/Colors';
import Sizes from '@/utils/Sizes';
import useContacts from '@/utils/useContacts';
import MasterCheckbox from '@/components/MasterCheckbox';
import { FontAwesome5 } from '@expo/vector-icons';

const ContactsList = (props) => {
  const {
    toolsBar = true,
    bgColor = 'transparent',
    fetchSelected = () => {},
  } = props;

  const [keyword, setKeyword] = useState('');
  const [order, setOrder] = useState('Asc');
  const [keyError, setKeyError] = useState(false);
  const [selectedArray, setSelectedArray] = useState([]);
  const [allSelected, setAllSelected] = useState(false);

  const { contacts } = useContacts();

  const blurHandler = (name, error) => name && setKeyError(error);

  const handleInput = (obj) => setKeyword(obj.value);

  const toggleOrder = () => {
    const newOrder = order === 'Asc' ? 'Desc' : 'Asc';
    setOrder(newOrder);
  };

  const contactListFiltered = contacts.filter((contact) =>
    contact?.name.toLowerCase().includes(keyword.toLowerCase())
  );

  const contactsSorted = contactListFiltered.sort((a, b) => {
    if (order === 'Asc') {
      return a.name.localeCompare(b.name);
    }
    return b.name.localeCompare(a.name);
  });

  const onCheck = useCallback(
    (contact) => {
      let previous = [...selectedArray];
      if (!previous.find((x) => x.id === contact.id)) {
        previous.push(contact);
      } else {
        previous = previous?.filter((x) => x.id !== contact.id);
      }
      setSelectedArray(previous);
    },
    [selectedArray]
  );

  useEffect(() => {
    let previous = [...contacts];
    if (allSelected) {
      setSelectedArray(
        previous.map((i) => {
          i.selected = true;
          return i;
        })
      );
    } else {
      previous = previous.map((i) => {
        i.selected = false;
        return i;
      });
      setSelectedArray([]);
    }
  }, [allSelected, setAllSelected]);

  useEffect(() => {
    fetchSelected(selectedArray);
  }, [selectedArray]);

  const keyExtractor = (i, idx) => {
    return i?.id?.toString() || idx.toString();
  };

  const renderItem = (i) => {
    const { item } = i;
    if (item !== undefined) {
      return <ContactItem contact={item} onPress={onCheck} />;
    }
  };

  const contactsListHeader = () => {
    return (
      <View style={styles.contactsPage}>
        <MasterInput
          inputLabel='Search contacts'
          textColor='light'
          onInput={handleInput}
          onBlur={blurHandler}
          startIcon='search'
          iconFamily='FontAwesome'
          name='searchkey'
          value={keyword}
          error={keyError}
          rounded={true}
          width='95%'
        />

        {toolsBar && (
          <View style={[styles.sortButton, styles.mbRegular]}>
            <MasterCheckbox
              onPress={() => setAllSelected(!allSelected)}
              isChecked={allSelected}
              size='large'
              color='dark'
              isIntermediate={false}
            />
            <Text>{contactsSorted.length} Contacts</Text>
            <TouchableOpacity onPress={toggleOrder}>
              {order === 'Asc' ? (
                <FontAwesome5 name='sort-alpha-down' size={24} color='black' />
              ) : (
                <FontAwesome5 name='sort-alpha-up' size={24} color='black' />
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const styles = StyleSheet.create({
    contactsList: {
      flex: 1,
      backgroundColor: bgColor,
    },
    sortButton: {
      backgroundColor: Colors.$gray,
      padding: Sizes.$iePadding,
      borderRadius: Sizes.$ieBorderRadius,
      borderBottomColor: Colors.$activeBar,
      borderBottomWidth: 2,
      marginHorizontal: Sizes.$ieMargin,
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
    },
    mbRegular: {
      marginBottom: Sizes.$ieMargin,
    },
    contactsPage: {
      borderBottomWidth: 1,
      paddingBottom: Sizes.$iePadding,
      paddingHorizontal: Sizes.$iePadding,
    },
  });

  return (
    <FlatList
      data={contactsSorted}
      ListHeaderComponent={contactsListHeader()}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      style={styles.contactsList}
      removeClippedSubviews={true}
    />
  );
};

export default ContactsList;