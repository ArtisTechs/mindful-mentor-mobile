import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  useGlobalContext,
  fetchJournalsByUser,
  toastService,
  EErrorMessages,
  formatDate,
  loadingService,
} from "../../shared";
import theme from "../../shared/styles/theme";
import { DateFormat } from "../../shared/enum/date-format.enum";

const JournalListScreen = () => {
  const { currentUserDetails } = useGlobalContext();
  const navigation = useNavigation();
  const [journals, setJournals] = useState([]);

  useEffect(() => {
    if (currentUserDetails?.id) {
      loadJournals();
    }
  }, [currentUserDetails]);

  const loadJournals = async () => {
    loadingService.show();
    try {
      if (currentUserDetails?.id) {
        const journalData = await fetchJournalsByUser({
          userId: currentUserDetails?.id,
          sortBy: "entryDate",
          asc: true,
        });
        setJournals(journalData);
      }
    } catch (error) {
      toastService.show(EErrorMessages.CONTACT_ADMIN, "error");
    } finally {
      loadingService.hide();
    }
  };

  const handleView = (journalId) => {
    navigation.navigate("JournalDetail", { journalId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>My Journals</Text>
      <View style={styles.listContainer}>
        <ScrollView contentContainerStyle={styles.list}>
          {journals.map((journal) => (
            <TouchableOpacity
              key={journal.id}
              style={styles.journalItem}
              onPress={() => handleView(journal.id)}
            >
              <View style={styles.journalItemLabel}>
                <Text style={styles.journalTitle}>{journal.title}</Text>
                <Text style={styles.journalDate}>
                  {formatDate(journal.entryDate, DateFormat.MONTH_DAY_YEAR)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <TouchableOpacity
        style={styles.newButton}
        onPress={() => navigation.navigate("JournalDetail", { isNew: true })}
      >
        <Text style={styles.newButtonText}>New Journal</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  listContainer: {
    backgroundColor: theme.colors.primary,
    padding: 15,
    borderRadius: 20,
    height: "85%",
  },
  list: {
    backgroundColor: theme.colors.primary,
    paddingBottom: 15,
  },
  journalItem: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  journalItemLabel: {
    flexDirection: "column",
  },
  journalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  journalDate: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  newButton: {
    backgroundColor: theme.colors.secondary,
    padding: 16,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 16,
  },
  newButtonText: {
    color: theme.colors.white,
    fontSize: 16,
  },
});

export default JournalListScreen;
